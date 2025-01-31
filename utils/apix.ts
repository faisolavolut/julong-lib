import get from "lodash.get";
import api from "./axios";

type apixType = {
  port: "portal" | "recruitment" | "mpp";
  path: string;
  method?: "get" | "delete" | "post" | "put";
  data?: any;
  value?: any;
  validate?: "object" | "array" | "dropdown";
  type?: "usual" | "form";
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
  type = "usual",
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
    // Convert data to FormData if type is "form"
    const execption = ["certificate"];
    const requestData =
      type === "form" && data
        ? Object.entries(data as any).reduce((formData, [key, value]) => {
            formData.append(
              key.includes("certificate") ? key : key.replace(/\[\d+\]/, ""),
              value as any
            );
            return formData;
          }, new FormData())
        : data;

    try {
      switch (method) {
        case "get":
          result = await api.get(root_url);
          break;

        case "post":
          result = await api.post(root_url, requestData, {
            headers:
              type === "form" ? { "Content-Type": "multipart/form-data" } : {},
          });
          break;

        case "put":
          result = await api.put(root_url, requestData, {
            headers:
              type === "form" ? { "Content-Type": "multipart/form-data" } : {},
          });
          break;

        case "delete":
          result = await api.delete(root_url, { data: requestData });
          break;

        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (ex: any) {
      throw new Error(get(ex, "response.data.meta.message") || ex.message);
    }

    const val = get(result, value);
    return validate === "object"
      ? get(result, value)
      : validate === "dropdown" && Array.isArray(get(result, value))
      ? val.map((e: any) => {
          return {
            value: keys?.value ? get(e, keys?.value) : get(e, "id"),
            data: e,
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
function removeIndexFromKey(obj: any) {
  let result = {} as any;

  for (const [key, value] of Object.entries(obj)) {
    const newKey = key.replace(/\[\d+\]/, ""); // Hapus indeks [n] dari key
    result[newKey] = value;
  }

  return result;
}
