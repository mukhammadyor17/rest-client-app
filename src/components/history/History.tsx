"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import EmptyHistory from "@/components/history/EmptyHistory.tsx";
import ErrorModal from "@/components/ui/ErrorModal.tsx";
import Loader from "@/components/ui/Loader.tsx";
import { HistoryRow } from "types/history";
import { createRequestUrl } from "../../utils/rest-client-utils.ts";

type HistoryResponse = { data: HistoryRow[] };

const History = () => {
  const [requests, setRequests] = useState<HistoryResponse | null | undefined>(
    undefined
  );
  const [error, setError] = useState<Error | null>(null);
  const history = useTranslations("Main");
  const modal = useTranslations("Modal");
  const table = useTranslations("Table");
  const router = useRouter();

  async function fetchHistory() {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        return await response.json();
      } else {
        setError(new Error("Ошибка HTTP:" + response.statusText));
        return null;
      }
    } catch (err: any) {
      setError(new Error("Ошибка загрузки истории: " + err.message));
      return null;
    }
  }

  useEffect(() => {
    fetchHistory().then((res) => {
      if (res) {
        setRequests(res);
      }
    });
  }, []);

  const handleRowClick = (item: HistoryRow) => {
    const { method, url, body, headers } = item;
    const stringToPaste = createRequestUrl(
      "/rest-client",
      method,
      url,
      body || "",
      headers
    );
    router.push(stringToPaste);
  };

  return (
    <div className="w-full">
      {requests === undefined ? (
        <Loader />
      ) : requests?.data.length === 0 ? (
        <EmptyHistory />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            {history("history")}
          </h1>
          <div className="flex w-full">
            <table className="min-w-full overflow-x-auto border border-gray-200 rounded-lg text-sm sm:text-base">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-2 py-2 text-center">{table("method")}</th>
                  <th className="px-2 py-2 text-center">{table("url")}</th>
                  <th className="px-2 py-2 text-center">{table("status")}</th>
                  <th className="px-2 py-2 text-center">{table("created")}</th>
                  <th className="px-2 py-2 text-centert">{table("latency")}</th>
                  <th className="px-2 py-2 text-center">
                    {table("request_size")}
                  </th>
                  <th className="px-2 py-2 text-center">
                    {table("response_size")}
                  </th>
                  <th className="px-2 py-2 text-center">{table("error")}</th>
                </tr>
              </thead>
              <tbody>
                {requests?.data
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((item) => (
                    <tr
                      key={item.created_at}
                      onClick={() => handleRowClick(item)}
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-2 py-2 font-mono">{item.method}</td>
                      <td className="px-2 py-2 truncate max-w-[200px] sm:max-w-[400px]">
                        {item.url}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          item.status_code >= 200 && item.status_code < 300
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status_code}
                      </td>
                      <td className="px-2 py-2">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-2 py-2">{item.latency_ms} ms</td>
                      <td className="px-2 py-2">{item.request_size} bytes</td>
                      <td className="px-2 py-2">{item.response_size} bytes</td>
                      <td className="px-2 py-2 text-red-500">
                        {item.error ?? "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {error && (
        <ErrorModal
          open={true}
          title={modal("title")}
          onClose={() => setError(null)}
          message={error.message}
        />
      )}
    </div>
  );
};

export default History;
