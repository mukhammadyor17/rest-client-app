import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const EmptyHistory = () => {
  const t = useTranslations("EmptyHistory");

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 w-full flex flex-col items-center">
      <h3 className="text-center text-2xl font-bold mb-5">{t("title")}</h3>
      <ul className="text-lg text-center">
        <li>{t("description")}</li>
        <li className="flex flex-col items-center gap-2">
          <label>{t("tryOptions")}</label>
          <Link
            href="/rest-client"
            className="text-indigo-600 whitespace-nowrap max-md:text-[14px] hover:text-indigo-800 transition font-medium active:scale-95"
          >
            {t("restClientLink")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default EmptyHistory;
