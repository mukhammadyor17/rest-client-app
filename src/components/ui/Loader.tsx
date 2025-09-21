import React from "react";

const Loader = () => {
  return (
    <div
      role="status"
      className="w-10 h-10 mx-auto my-[calc(50vh-10px)] rounded-full border-2 border-neutral-900 border-t-neutral-500 animate-spin dark:border-neutral-50 dark:border-t-neutral-400"
    ></div>
  );
};

export default Loader;
