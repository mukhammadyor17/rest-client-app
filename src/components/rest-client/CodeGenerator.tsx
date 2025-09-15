"use client";
import { useState } from "react";
import { generateCode } from "../../utils/rest-client-utils.ts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { HttpMethod } from "../../types/rest-client.ts";

type Language =
  | "curl"
  | "javascript_fetch"
  | "javascript_xhr"
  | "node"
  | "python"
  | "java"
  | "csharp"
  | "go";

interface CodeGeneratorProps {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

const tabs: { label: string; key: Language; lang: string }[] = [
  { label: "cURL", key: "curl", lang: "bash" },
  { label: "JS Fetch", key: "javascript_fetch", lang: "javascript" },
  { label: "JS XHR", key: "javascript_xhr", lang: "javascript" },
  { label: "Node.js", key: "node", lang: "javascript" },
  { label: "Python", key: "python", lang: "python" },
  { label: "Java", key: "java", lang: "java" },
  { label: "C#", key: "csharp", lang: "csharp" },
  { label: "Go", key: "go", lang: "go" },
];

export default function CodeGenerator({
  url,
  method,
  headers,
  body,
}: CodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState<Language>("curl");

  const codes = generateCode({ url, method, headers, body });
  const code = codes[activeTab];

  function copyToClipboard() {
    void navigator.clipboard.writeText(code);
  }

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white space-y-4">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Copy
        </button>
        <SyntaxHighlighter
          language={tabs.find((t) => t.key === activeTab)?.lang || "text"}
          style={oneDark}
          customStyle={{
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            padding: "1rem",
            maxHeight: "400px",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
