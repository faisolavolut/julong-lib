import { empty } from "./isStringEmpty";

export const generateQueryString = (data: Record<string, any>) => {
  // Priksa menapa input punika bentukipun object lan mboten null
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return "";
  }

  // Nyaring nilai null utawi undefined, lajeng priksa menapa object punika kosong sasampunipun disaring
  const filteredData = Object.keys(data)
    .filter((key) => {
      if (typeof data[key] === "string") return !empty(data[key]);
      return data[key] !== undefined && data[key] !== null;
    })
    .reduce((obj: any, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  if (Object.keys(filteredData).length === 0) {
    return ""; // Wangsul string kosong menawi object ingkang sampun disaring kosong
  }

  // Nggawe query string saking data ingkang sampun disaring
  const queryString = Object.keys(filteredData)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(filteredData[key])}`
    )
    .join("&");

  return "?" + queryString;
};
