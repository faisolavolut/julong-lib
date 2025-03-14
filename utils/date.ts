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

export const formatDay = (date: string | Date, format: string) => {
  if (date instanceof Date || typeof date === "string") {
    return day(date).format(format);
  }
  return null;
};

export const dayDate = (date: string | Date) => {
  if (date instanceof Date || (typeof date === "string" && !empty(date))) {
    return day(date).format("DD MMMM YYYY");
  }
  return "-";
};
export const monthYearDate = (date: string | Date) => {
  if (date instanceof Date || (typeof date === "string" && !empty(date))) {
    return day(date).format("MMMM YYYY");
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
    return day(date).format("HH:mm");
  }
  return "-";
};

export const time = (date: string | Date) => {
  if (date === "string") {
    const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (timeFormatRegex.test(date)) {
      return date; // Jika sudah format HH:mm, langsung return
    }
  }
  if (date instanceof Date || typeof date === "string") {
    return day(date).format("HH:mm");
  }
  return null;
};
