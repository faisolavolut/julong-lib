"use client";

import { siteurl } from "@/lib/utils/siteurl";
import React from "react";

interface HeaderProps {
  title: string;
  description?: string;
  author?: string;
  robots?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  author,
  robots,
}) => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {description && <meta name="description" content={description} />}
      {author && <meta name="author" content={author} />}
      <meta name="generator" content="Next.js" />
      <title>{title}</title>
      <link rel="icon" href={siteurl("/logo.ico")} type="image/x-icon" />
      <link
        rel="canonical"
        href="https://www.creative-tim.com/product/soft-ui-dashboard-pro-flowbite"
      />
      {robots && <meta name="robots" content={robots} />}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
    </>
  );
};

export default Header;
