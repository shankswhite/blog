import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 md:px-10 lg:py-10"
    >
      {children}
    </main>
  );
};
