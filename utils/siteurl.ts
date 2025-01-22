import dotenv from "dotenv";
dotenv.config();
export const siteurl = (param: string) => {
  if (param && param.startsWith("http")) return param;
  return `${process.env.NEXT_PUBLIC_BASE_URL + param}`;
};
