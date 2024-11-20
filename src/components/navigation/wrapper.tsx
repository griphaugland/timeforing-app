import React from "react";

function Wrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid min-h-screen grid-rows-[auto_1fr] supports-[min-height:100svh]:min-h-svh ${className}`}
    >
      {children}
    </div>
  );
}

export default Wrapper;
