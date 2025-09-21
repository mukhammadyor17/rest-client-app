"use client";

import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { BodyProps } from "../../types/rest-client.ts";

const Body = ({
  type,
  placeholder,
  value,
  onchange,
  status,
  handlePrettify,
}: BodyProps) => {
  const rest = useTranslations("RestClient");

  function onChangeHandler(e: ChangeEvent<HTMLTextAreaElement> | string) {
    if ((e as ChangeEvent<HTMLTextAreaElement>).target) {
      const text: string = (e as ChangeEvent<HTMLTextAreaElement>).target.value;
      onchange(text);
    } else if (typeof e === "string") {
      onchange(e);
    }
  }

  let parsed = null;
  if (status && value) {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = null;
    }
  }

  return (
    <div className="relative flex-col w-full max-w-full">
      <h2>{type === "request" ? rest("body") : rest("response")}</h2>
      <textarea
        readOnly={type === "response"}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        rows={10}
        className="w-full border px-2 py-1 font-mono text-sm"
      />

      <div className="absolute top-0 right-0 flex gap-2">
        {parsed ? (
          <>
            <span className="text-[16px]">{`Status: ${parsed.status ?? ""}`}</span>
            {parsed.statusText && (
              <span className="text-[16px]">{parsed.statusText}</span>
            )}
          </>
        ) : (
          <button
            type="button"
            disabled={!value}
            className="hover:cursor-pointer active:underline active:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => onchange("")}
          >
            {rest("clear")}
          </button>
        )}
        <button
          type="button"
          disabled={!value}
          className="text-[16px] text-indigo-600   rounded hover:cursor-pointer hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={() => {
            if (value) {
              handlePrettify(value);
            }
          }}
        >
          {rest("prettify")}
        </button>
      </div>
    </div>
  );
};

export default Body;
