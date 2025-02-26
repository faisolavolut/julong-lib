import get from "lodash.get";
import { generateQueryString } from "./generateQueryString";

type EventActions = "before-onload" | "onload-param" | string;
export const events = async (action: EventActions, data: any) => {
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
      return generateQueryString(params);
      return;
      break;

    default:
      break;
  }
  return "";
};
