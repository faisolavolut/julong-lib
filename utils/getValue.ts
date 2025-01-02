import get from "lodash.get"

export const getValue = (data: any, keys: string) => {
    return get(data, keys) ? get(data, keys) : ""
}