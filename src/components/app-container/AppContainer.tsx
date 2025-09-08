import React, { ReactNode } from "react";
import Image from "next/image";

type AppContainerProps = {
  children: ReactNode;
};

const AppContainer = ({ children }: AppContainerProps) => {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header>Header</header>
      {children}
      <footer className="row-start-3 flex gap-[84px]  items-center justify-between ">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/mukhammadyor17"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark.svg"
            alt="github icon"
            width={96}
            height={96}
            style={{
              width: "40px",
              height: "auto",
            }}
          />
        </a>
        <>2025</>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/rss-logo.svg"
            alt="rss-course icon"
            width={64}
            height={64}
            style={{
              width: "40px",
              height: "auto",
            }}
          />
        </a>
      </footer>
    </div>
  );
};

export default AppContainer;
