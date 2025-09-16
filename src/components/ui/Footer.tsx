import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full max-w-5xl max-sm:px-4 mx-auto px-6 py-6 flex items-center justify-between border-t border-gray-200 text-sm text-gray-600 ">
      <a
        className="flex items-center gap-2 hover:text-indigo-600 no-underline transition-all duration-200 active:underline active:text-indigo-800"
        href="https://github.com/mukhammadyor17"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/github-mark.svg"
          alt="github icon"
          width={20}
          height={20}
        />
        GitHub
      </a>

      <span>© 2025 Rs Client App</span>

      <a
        className="flex items-center gap-2 hover:text-indigo-600 transition active:underline"
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/rss-logo.svg"
          alt="rss-course icon"
          width={20}
          height={20}
        />
        RS School
      </a>
    </footer>
  );
};

export default Footer;
