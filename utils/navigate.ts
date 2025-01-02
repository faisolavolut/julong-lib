"use client";

import { useRouter } from "next/navigation";
export const navigate = (path: string) => {
  if (!router) throw new Error("Router instance is not set.");
  router.push(path);
};

// Fungsi navigasi dengan query parameter
export const navigateWithQuery = (path: string, query: Record<string, string>) => {
  if (!router) throw new Error("Router instance is not set.");
  const url = new URL(window.location.origin + path);
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  router.push(url.toString());
};

// Fungsi replace
export const replace = (path: string) => {
  if (!router) throw new Error("Router instance is not set.");
  router.replace(path);
};
