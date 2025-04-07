// src/components/Page.jsx
import React, { useEffect } from "react";

const Page = ({ title, children }) => {
  useEffect(() => {
    document.title = title ? `AI Virtual Assistant – ${title}` : "AI Virtual Assistant";
  }, [title]);

  return <>{children}</>;
};

export default Page;
