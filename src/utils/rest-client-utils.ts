import { HeadersType, HttpMethod } from "../types/rest-client";

export function createRequestUrl(
  base: string,
  method: string,
  url: string,
  body?: object | string | null,
  headers: Record<string, string> = {}
): string {
  const encodedUrl = btoa(url);
  let encodedBody = "";

  if (body) {
    const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
    encodedBody = "/" + btoa(bodyStr);
  }

  const queryParams = new URLSearchParams();
  Object.entries(headers).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  const queryString = queryParams.toString()
    ? "?" + queryParams.toString()
    : "";

  return `${base}/${method}/${encodedUrl}${encodedBody}${queryString}`;
}

export function parseUrl(url: string) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  const method = parts[1];
  const encodedUrl = parts[2];
  const encodedBody = parts[3];

  const decodedUrl = encodedUrl ? atob(encodedUrl) : "";
  const decodedBody = encodedBody ? atob(encodedBody) : "";

  const headers: Record<string, string> = {};
  u.searchParams.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    method,
    url: decodedUrl,
    body: decodedBody,
    headers,
  };
}

export function beautify(
  value: string,
  type: "json" | "text" = "json"
): string {
  if (!value.trim()) return "";

  if (type === "json") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON format");
      }
      throw error;
    }
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

interface GenerateCodeParams {
  url: string;
  method: HttpMethod;
  headers: HeadersType;
  body?: string;
}

export function generateCode({
  url,
  method,
  headers,
  body,
}: GenerateCodeParams) {
  const headersJSON = JSON.stringify(headers, null, 2);

  return {
    curl: `
curl -X ${method} "${url}"${
      Object.keys(headers).length
        ? " \\\n  -H " +
          Object.entries(headers)
            .map(([k, v]) => `"${k}: ${v}"`)
            .join(" \\\n  -H ")
        : ""
    }${
      body && method !== "GET"
        ? ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`
        : ""
    }
`.trim(),

    javascript_fetch: `
fetch("${url}", {
  method: "${method}",
  headers: ${headersJSON},
  ${body && method !== "GET" ? `body: ${JSON.stringify(body)},` : ""}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
`.trim(),

    javascript_xhr: `
var xhr = new XMLHttpRequest();
xhr.open("${method}", "${url}");
${Object.entries(headers)
  .map(([k, v]) => `xhr.setRequestHeader("${k}", "${v}");`)
  .join("\n")}
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(xhr.responseText);
  } else {
    console.error(xhr.status, xhr.statusText);
  }
};
xhr.onerror = function () { console.error(xhr.statusText); };
${body && method !== "GET" ? `xhr.send(${JSON.stringify(body)});` : "xhr.send();"}
`.trim(),

    node: `
const fetch = require("node-fetch");

fetch("${url}", {
  method: "${method}",
  headers: ${headersJSON},
  ${body && method !== "GET" ? `body: ${JSON.stringify(body)},` : ""}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
`.trim(),

    python: `
import requests

url = "${url}"
headers = ${headersJSON}
${body && method !== "GET" ? `data = ${JSON.stringify(body)}\n` : ""}
response = requests.request("${method}", url, headers=headers${
      body && method !== "GET" ? ", data=data" : ""
    })

print(response.status_code)
print(response.text)
`.trim(),

    java: `
import java.io.*;
import java.net.*;
import java.util.*;

public class Main {
  public static void main(String[] args) throws Exception {
    URL url = new URL("${url}");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("${method}");
${Object.entries(headers)
  .map(([k, v]) => `    conn.setRequestProperty("${k}", "${v}");`)
  .join("\n")}
    conn.setDoOutput(true);
${
  body && method !== "GET"
    ? `    try(OutputStream os = conn.getOutputStream()) {
      byte[] input = "${body}".getBytes("utf-8");
      os.write(input, 0, input.length);
    }`
    : ""
}
    int status = conn.getResponseCode();
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String line;
    StringBuilder response = new StringBuilder();
    while ((line = in.readLine()) != null) {
      response.append(line);
    }
    in.close();
    System.out.println(status);
    System.out.println(response.toString());
  }
}
`.trim(),

    csharp: `
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${method}, "${url}");
${Object.entries(headers)
  .map(([k, v]) => `    request.Headers.Add("${k}", "${v}");`)
  .join("\n")}
${
  body && method !== "GET"
    ? `    request.Content = new StringContent("${body}", Encoding.UTF8, "application/json");`
    : ""
}
    var response = await client.SendAsync(request);
    string result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(response.StatusCode);
    Console.WriteLine(result);
  }
}
`.trim(),

    go: `
package main

import (
  "bytes"
  "fmt"
  "io/ioutil"
  "net/http"
)

func main() {
  url := "${url}"
  method := "${method}"

  payload := []byte(${body && method !== "GET" ? JSON.stringify(body) : `""`})

  client := &http.Client{}
  req, err := http.NewRequest(method, url, bytes.NewBuffer(payload))
  if err != nil {
    panic(err)
  }
${Object.entries(headers)
  .map(([k, v]) => `  req.Header.Add("${k}", "${v}")`)
  .join("\n")}
  res, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer res.Body.Close()

  body, _ := ioutil.ReadAll(res.Body)
  fmt.Println("Status:", res.Status)
  fmt.Println("Response:", string(body))
}
`.trim(),
  };
}
