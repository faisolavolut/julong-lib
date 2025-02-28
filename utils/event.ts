import get from "lodash.get";
import { generateQueryString } from "./generateQueryString";
import { empty } from "./isStringEmpty";

type EventActions = "before-onload" | "onload-param" | string;
export const events = async (action: EventActions, data: any, param?: any) => {
  switch (action) {
    case "onload-param":
      let params = {
        ...data,
        page: get(data, "paging"),
        page_size: get(data, "take"),
        search: get(data, "search"),
      };
      params = {
        ...params,
      };
      if (params?.sort) {
        params = {
          ...params,
          ...params?.sort,
        };
      }
      delete params["sort"];
      delete params["paging"];
      delete params["take"];
      const result = generateQueryString(params);
      const parameter2 =
        typeof param === "string" && param ? param?.replace(/^\?/, "") : "";
      if (result)
        return `${result}${!empty(parameter2) ? `&${parameter2}` : ``}`;
      if (empty(result) && !empty(param)) return param;
      return "";
      break;

    default:
      break;
  }
  return "";
};
