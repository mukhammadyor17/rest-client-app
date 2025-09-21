import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 m-20 w-full flex flex-col items-center flex-1">
      <h3 className="text-center text-2xl font-bold mb-5">
        {t("NotFound.title")}
      </h3>
      <ul className="text-lg">
        <li className="flex flex-col items-center gap-2">
          <label>{t("NotFound.returnLabel")}</label>
          <Link
            href="/"
            className="text-indigo-600 whitespace-nowrap max-md:text-[14px] hover:text-indigo-800 transition font-medium active:scale-95"
          >
            {t("NotFound.mainPageLink")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NotFound;
