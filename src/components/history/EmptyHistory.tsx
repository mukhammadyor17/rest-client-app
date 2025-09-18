import React from "react";
import Link from "next/link";

const EmptyHistory = () => {
  return (
    <section className="flex text-lg flex-col gap-2.5 items-center justify-center">
      <h2 className="text-2xl font-bold text-center">It&apos;s empty here.</h2>
      <ul>
        <li>You haven &apos;t executed any requests yet</li>
        <li className="flex flex-col items-center">
          <label>Try those options:</label>
          <Link
            href="/rest-client"
            className="text-indigo-600 whitespace-nowrap text-[16px] max-md:text-[14px] hover:text-indigo-800 transition font-medium active:underline active:scale-95"
          >
            REST Client
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default EmptyHistory;
