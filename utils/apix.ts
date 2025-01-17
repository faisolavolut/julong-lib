import get from "lodash.get";
import api from "./axios";

type apixType = {
  port: "portal" | "recruitment" | "mpp";
  path: string;
  method?: "get" | "delete" | "post" | "put";
  data?: any;
  value?: any;
  validate?: "object" | "array" | "dropdown";
  keys?: {
    value?: string;
    label: string | ((item: any) => string);
  };
};
export const apix = async ({
  port = "portal",
  method = "get",
  data,
  value,
  path,
  validate = "object",
  keys,
}: apixType) => {
  const root_url = `${
    port === "portal"
      ? process.env.NEXT_PUBLIC_API_PORTAL
      : port === "recruitment"
      ? process.env.NEXT_PUBLIC_API_RECRUITMENT
      : port === "mpp"
      ? process.env.NEXT_PUBLIC_API_MPP
      : ""
  }${path}`;
  let result = null as any;
  try {
    try {
      switch (method) {
        case "get":
          result = await api.get(root_url);
          break;

        case "post":
          result = await api.post(root_url, data);
          break;

        case "put":
          result = await api.put(root_url, data);
          break;

        case "delete":
          result = await api.delete(root_url, data);
          break;

        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (ex: any) {
      console.error(
        "API Error:",
        get(ex, "response.data.meta.message") || ex.message
      );
    }
    const val = get(result, value);
    return validate === "object"
      ? get(result, value)
      : validate === "dropdown" && Array.isArray(get(result, value))
      ? val.map((e: any) => {
          return {
            value: keys?.value ? get(e, keys?.value) : get(e, "id"),
            label:
              typeof keys?.label === "function"
                ? keys.label(e)
                : keys?.label
                ? get(e, keys?.label)
                : null,
          };
        })
      : Array.isArray(get(result, value))
      ? get(result, value)
      : [];
  } catch (error: any) {
    console.error("API Error:", error.response || error.message);
    throw error;
  }
};
