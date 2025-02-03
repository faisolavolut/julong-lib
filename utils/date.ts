import day from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { empty } from "./isStringEmpty";

day.extend(relative);

export const longDate = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return day(date).format("DD MMM YYYY - hh:mm");
  }
  return "-";
};

export const dayDate = (date: string | Date) => {
  if (date instanceof Date || (typeof date === "string" && !empty(date))) {
    return day(date).format("DD MMMM YYYY");
  }
  return "-";
};
export const shortDate = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    const formattedDate = day(date);
    if (formattedDate.isValid()) {
      return formattedDate.format("DD/MM/YYYY");
    }
  }
  return "-";
};

export const normalDate = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return day(date).format("YYYY-MM-DD");
  }
  return null;
};

export const timeAgo = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return day(date).fromNow();
  }
  return "-";
};
export const formatTime = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return day(date).format("hh:mm");
  }
  return "-";
};
