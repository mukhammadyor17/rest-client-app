import React from "react";
import Link from "next/link";

const EmptyHistory = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 w-full flex flex-col  items-center">
      <h3 className="text-center text-2xl font-bold mb-5">
        It&apos;s empty here.
      </h3>
      <ul className="text-lg">
        <li>You haven &apos;t executed any requests yet</li>
        <li className="flex flex-col items-center gap-2">
          <label>Try those options:</label>
          <Link
            href="/rest-client"
            className="text-indigo-600 whitespace-nowrap max-md:text-[14px] hover:text-indigo-800 transition font-medium active:scale-95"
          >
            REST Client
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default EmptyHistory;
