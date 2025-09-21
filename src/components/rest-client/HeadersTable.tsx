"use client";
import { useTranslations } from "next-intl";

interface Header {
  key: string;
  value: string;
}

interface HeadersTableProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

export default function HeadersTable({ headers, onChange }: HeadersTableProps) {
  const rest = useTranslations("RestClient");

  function handleAddRow() {
    onChange([...headers, { key: "", value: "" }]);
  }

  function handleChange(index: number, field: "key" | "value", value: string) {
    const updated = headers.map((h, i) =>
      i === index ? { ...h, [field]: value } : h
    );
    onChange(updated);
  }

  function handleRemove(index: number) {
    onChange(headers.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2 flex-col ">
      <div className="flex justify-between  p-0.5 max-sm:flex-col">
        <h2 className="text-lg font-medium text-center">{rest("headers")}</h2>
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-indigo-600 text-white px-4 py-1 rounded max-sm:w-full hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-99"
        >
          {rest("addHeader")}
        </button>
      </div>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">{rest("headerKey")}</th>
            <th className="border px-2 py-1 text-left">
              {rest("headerValue")}
            </th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {headers.map((h, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={h.key}
                  placeholder="Content-Type"
                  onChange={(e) => handleChange(i, "key", e.target.value)}
                  className="w-full border px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={h.value}
                  placeholder="application/json"
                  onChange={(e) => handleChange(i, "value", e.target.value)}
                  className="w-full border px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="text-red-600 hover:underline hover:cursor-pointer active:opacity-50 active:scale-99"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
