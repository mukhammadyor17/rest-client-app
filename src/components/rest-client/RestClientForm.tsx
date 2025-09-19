"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  BodyType,
  CustomResponseBody,
  ErrorResponseBody,
  HeadersType,
  HttpMethod,
} from "../../types/rest-client";
import {
  beautify,
  createRequestUrl,
  parseUrl,
} from "../../utils/rest-client-utils";
import ErrorModal from "@/components/ui/ErrorModal.tsx";
import Body from "@/components/rest-client/Body.tsx";
import HeadersTable from "@/components/rest-client/HeadersTable.tsx";
import CodeGenerator from "@/components/rest-client/CodeGenerator.tsx";

export default function RestClientForm() {
  const rest = useTranslations("RestClient");
  const modal = useTranslations("Modal");

  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [showCodeGen, setShowCodeGen] = useState(false);

  useEffect(() => {
    try {
      const parsed = parseUrl(window.location.href);
      if (parsed.url) setUrl(parsed.url);
      if (parsed.method) setMethod(parsed.method as HttpMethod);
      if (parsed.body) setBody(parsed.body);
      if (parsed.headers && Object.keys(parsed.headers).length > 0) {
        const headersArray = Object.entries(parsed.headers).map(([k, v]) => ({
          key: k,
          value: String(v),
        }));
        setHeaders(headersArray);
      }
    } catch (e) {
      setError(new Error(`${rest("omitted")}: ${(e as Error).message}`));
    }
  }, []);

  function editBody(newValue: string | Error) {
    if (typeof newValue === "string") {
      setBody(newValue);
    } else {
      setError(new Error(`${rest("bodyError")}: ${newValue.message}`));
    }
  }

  function editResponse(newValue: string | Error) {
    if (typeof newValue === "string") {
      setResponse(newValue);
    } else {
      setError(new Error(`${rest("responseError")}: ${newValue.message}`));
    }
  }

  async function sendRequest() {
    setResponse("");
    setStatus("");
    setLoading(true);
    setShowCodeGen(false);

    try {
      const parsedHeaders: HeadersType = {};
      for (const h of headers) {
        if (h.key.trim()) {
          parsedHeaders[h.key.trim()] = h.value;
        }
      }

      if (!url.trim()) {
        setError(new Error(rest("emptyUrl")));
        return;
      }

      const newUrl = createRequestUrl(
        "/rest-client",
        method,
        url,
        body || "",
        parsedHeaders
      );
      window.history.replaceState({}, "", newUrl);

      const res = await fetch("/api/rest-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          method,
          headers: parsedHeaders,
          body: body || "",
        }),
      });

      const data: CustomResponseBody | ErrorResponseBody = await res.json();

      if (!res.ok) {
        setResponse(JSON.stringify(data));
        return;
      }

      setStatus(String((data as CustomResponseBody).status));
      setResponse(JSON.stringify(data as CustomResponseBody));
      setShowCodeGen(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  function handlePrettify(bodyOrResponse: string) {
    try {
      if (bodyOrResponse === body) {
        setBody(beautify(body, "json"));
      } else if (bodyOrResponse === response) {
        setResponse(beautify(response, "json"));
      }
    } catch {
      setBody(beautify(body, "text"));
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 w-full flex flex-col">
      <h1 className="text-2xl font-bold text-center">{rest("title")}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendRequest();
        }}
        className="space-y-4"
      >
        <div className="flex gap-2 max-sm:flex-col">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="border px-2 py-1 hover:cursor-pointer"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            type="search"
            placeholder={rest("urlPlaceholder")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border px-2 py-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-99"
          >
            {loading ? rest("loading") : rest("send")}
          </button>
        </div>

        <HeadersTable headers={headers} onChange={setHeaders} />

        {method !== "GET" && (
          <div className="flex flex-col gap-2.5">
            <Body
              type={BodyType.req}
              value={body}
              placeholder={rest("bodyPlaceholder")}
              onchange={editBody}
              handlePrettify={handlePrettify}
            />
          </div>
        )}
      </form>

      {response && (
        <Body
          type={BodyType.response}
          placeholder={rest("responsePlaceholder")}
          value={response}
          onchange={editResponse}
          status={status}
          handlePrettify={handlePrettify}
        />
      )}

      {showCodeGen && (
        <CodeGenerator
          url={url}
          method={method}
          headers={headers.reduce<Record<string, string>>((acc, h) => {
            if (h.key.trim()) {
              acc[h.key.trim()] = h.value;
            }
            return acc;
          }, {})}
          body={body}
        />
      )}

      {error && (
        <ErrorModal
          open={true}
          title={modal("title")}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
