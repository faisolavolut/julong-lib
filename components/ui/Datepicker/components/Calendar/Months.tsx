import dayjs from "dayjs";
import React, { useContext } from "react";

import { MONTHS } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import { loadLanguageModule } from "../../helpers";
import { RoundedButton } from "../utils";

interface Props {
  currentMonth: number;
  clickMonth: (month: number) => void;
  style?: string;
}

const Months: React.FC<Props> = ({ currentMonth, clickMonth, style }) => {
  const { i18n } = useContext(DatepickerContext);
  loadLanguageModule(i18n);
  return (
    <div
      className={cx(
        "w-full grid gap-2 mt-2",
        style === "custom" ? "uppercase grid-cols-2 p-4" : "grid-cols-2"
      )}
    >
      {MONTHS.map((item) => (
        <RoundedButton
          key={item}
          padding="py-3"
          onClick={() => {
            clickMonth(item);
          }}
          active={currentMonth === item}
          style={style}
        >
          {style === "custom" ? (
            <div className="px-2 py-1">
              {dayjs(`2022-${item}-01`).locale(i18n).format("MMMM")}
            </div>
          ) : (
            <>{dayjs(`2022-${item}-01`).locale(i18n).format("MMM")}</>
          )}
        </RoundedButton>
      ))}
    </div>
  );
};

export default Months;
