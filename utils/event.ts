import get from "lodash.get";
import { generateQueryString } from "./generateQueryString";

type EventActions = "before-onload" | "onload-param" | string; 
export const events = async (action: EventActions, data: any) => {
    switch (action) {
        case "onload-param":

            const params = {
                ...data,
                page: get(data, "paging"),
                page_size: get(data, "take"),
                search: get(data, "search")
            };
            delete params["paging"]
            delete params["take"]
            return generateQueryString(params)
            return 
            break;
    
        default:
            break;
    }
    return null
}