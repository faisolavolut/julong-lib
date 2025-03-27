import dotenv from "dotenv";
import { empty } from "./isStringEmpty";
dotenv.config();
export const siteurl = (
  param: string,
  port?: "portal" | "recruitment" | "mpp"
) => {
  if (param && param.startsWith("http")) return param;
  const root_url = `${
    port === "portal"
      ? process.env.NEXT_PUBLIC_API_PORTAL
      : port === "recruitment"
      ? process.env.NEXT_PUBLIC_API_RECRUITMENT
      : port === "mpp"
      ? process.env.NEXT_PUBLIC_API_MPP
      : process.env.NEXT_PUBLIC_BASE_URL
  }${param}`;
  if (port && empty(param)) return "";
  return `${root_url}`;
};
