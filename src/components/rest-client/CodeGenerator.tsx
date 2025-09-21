"use client";
import { useState } from "react";
import { HttpMethod } from "../../types/rest-client";
import { useTranslations } from "next-intl";

interface CodeGeneratorProps {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string;
}

export default function CodeGenerator({
  url,
  method,
  headers,
  body,
}: CodeGeneratorProps) {
  const [lang, setLang] = useState<string>("curl");
  const codegen = useTranslations("Code");

  function generateCode(): string {
    switch (lang) {
      case "curl":
        return `curl -X ${method} '${url}'${Object.entries(headers)
          .map(([k, v]) => ` -H '${k}: ${v}'`)
          .join("")}${body ? ` -d '${body}'` : ""}`;
      case "fetch":
        return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  body: ${body ? `"${body}"` : "undefined"}
});`;
      case "xhr":
        return `const xhr = new XMLHttpRequest();
xhr.open("${method}", "${url}");
${Object.entries(headers)
  .map(([k, v]) => `xhr.setRequestHeader("${k}", "${v}");`)
  .join("\n")}
xhr.send(${body ? `"${body}"` : "null"});`;
      case "node":
        return `const https = require("https");

const options = {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
};

const req = https.request("${url}", options, (res) => {
  res.on("data", (d) => process.stdout.write(d));
});

req.write(${body ? `"${body}"` : ""});
req.end();`;
      case "python":
        return `import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 2)}
data = ${body ? `"${body}"` : "None"}

response = requests.request("${method}", url, headers=headers, data=data)
print(response.text)`;
      case "java":
        return `import java.io.*;
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
${body ? `    conn.getOutputStream().write("${body}".getBytes());` : ""}
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      System.out.println(inputLine);
    }
    in.close();
  }
}`;
      case "csharp":
        return `using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${method}, "${url}");
${Object.entries(headers)
  .map(([k, v]) => `    request.Headers.Add("${k}", "${v}");`)
  .join("\n")}
${body ? `    request.Content = new StringContent("${body}");` : ""}
    var response = await client.SendAsync(request);
    var responseBody = await response.Content.ReadAsStringAsync();
    System.Console.WriteLine(responseBody);
  }
}`;
      case "go":
        return `package main

import (
  "bytes"
  "fmt"
  "io/ioutil"
  "net/http"
)

func main() {
  url := "${url}"
  method := "${method}"

  client := &http.Client{}
  req, _ := http.NewRequest(method, url, ${body ? `bytes.NewBuffer([]byte("${body}"))` : "nil"})
${Object.entries(headers)
  .map(([k, v]) => `  req.Header.Add("${k}", "${v}")`)
  .join("\n")}
  res, _ := client.Do(req)
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)
  fmt.Println(string(body))
}`;
      default:
        return "";
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generateCode());
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }

  return (
    <div className="mt-6 p-4 w-[90vw] rounded-2xl shadow-md bg-white space-y-4 max-w-full min-w-0">
      <div className="flex justify-between items-end w-full">
        <div className="flex flex-wrap gap-2">
          {[
            "curl",
            "fetch",
            "xhr",
            "node",
            "python",
            "java",
            "csharp",
            "go",
          ].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer active:scale-95 ${
                lang === l
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 border text-gray-700 hover:bg-indigo-100 hover:border-indigo-400"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="h-1/2 align-bottom text-[16px] px-3 py-1 rounded-md bg-gray-100 border text-indigo-600 cursor-pointer transition-colors hover:bg-indigo-100 hover:border-indigo-400 active:scale-95"
        >
          {codegen("copy")}
        </button>
      </div>

      <div className="relative">
        <pre className="p-3 bg-gray-100 text-gray-700 rounded-lg text-sm w-full max-w-full overflow-x-auto break-words whitespace-pre-wrap">
          <code>{generateCode()}</code>
        </pre>
      </div>
    </div>
  );
}
