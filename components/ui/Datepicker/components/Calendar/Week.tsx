import dayjs from "dayjs";
import React, { useContext, useMemo } from "react";

import { DAYS } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import { loadLanguageModule, shortString, ucFirst } from "../../helpers";
interface Props {
  style?: string;
}
const Week: React.FC<Props> = ({ style }) => {
  const { i18n, startWeekOn } = useContext(DatepickerContext);
  loadLanguageModule(i18n);
  const startDateModifier = useMemo(() => {
    if (startWeekOn) {
      switch (startWeekOn) {
        case "mon":
          return 1;
        case "tue":
          return 2;
        case "wed":
          return 3;
        case "thu":
          return 4;
        case "fri":
          return 5;
        case "sat":
          return 6;
        case "sun":
          return 0;
        default:
          return 0;
      }
    }
    return 0;
  }, [startWeekOn]);

  return (
    <div
      className={cx(
        " grid grid-cols-7 border-b  dark:border-gray-700",
        style === "custom"
          ? "sticky top-0 bg-white z-99 border-gray-200"
          : "border-gray-300  py-2",
        style === "custom" &&
          css`
            z-index: 99;
          `
      )}
    >
      {DAYS.map((item) => (
        <div
          key={item}
          className={cx(
            "tracking-wide text-gray-500 text-center",
            style === "custom" && " border-r border-gray-200 py-2"
          )}
        >
          {ucFirst(
            shortString(
              dayjs(`2022-11-${6 + (item + startDateModifier)}`)
                .locale(i18n)
                .format("ddd")
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Week;
