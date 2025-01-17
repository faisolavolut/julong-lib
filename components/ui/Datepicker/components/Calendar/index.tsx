import dayjs from "dayjs";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CALENDAR_SIZE, DATE_FORMAT } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import {
  formatDate,
  getDaysInMonth,
  getFirstDayInMonth,
  getFirstDaysInMonth,
  getLastDaysInMonth,
  getNumberOfDay,
  loadLanguageModule,
  nextMonth,
  previousMonth,
} from "../../helpers";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  RoundedButton,
} from "../utils";

import Days from "./Days";
import Months from "./Months";
import Week from "./Week";
import Years from "./Years";

import { DateType } from "../../types";
import { Popover } from "@/lib/components/Popover/Popover";

interface Props {
  date: dayjs.Dayjs;
  minDate?: DateType | null;
  maxDate?: DateType | null;
  onClickPrevious: () => void;
  onClickNext: () => void;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  mode?: "monthly" | "daily";
  onMark?: (day: number, date: Date, data?: any) => any;
  style?: "custom" | "prasi";
  onLoad?: (e?: any) => void | Promise<void>;
}

const Calendar: React.FC<Props> = ({
  date,
  minDate,
  maxDate,
  onClickPrevious,
  onClickNext,
  changeMonth,
  changeYear,
  onMark,
  mode = "daily",
  style = "prasi",
  onLoad,
}) => {
  // Contexts
  const {
    period,
    changePeriod,
    changeDayHover,
    showFooter,
    changeDatepickerValue,
    hideDatepicker,
    asSingle,
    i18n,
    startWeekOn,
    input,
  } = useContext(DatepickerContext);
  loadLanguageModule(i18n);

  // States
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [year, setYear] = useState(date.year());
  const [openPopover, setOpenPopover] = useState(false);
  const [openPopoverYear, setOpenPopoverYear] = useState(false);
  useEffect(() => {
    if (mode === "monthly") {
      setShowMonths(true);
      hideYears();
    }
  }, []);
  // Functions
  const previous = useCallback(() => {
    return getLastDaysInMonth(
      previousMonth(date),
      getNumberOfDay(getFirstDayInMonth(date).ddd, startWeekOn)
    );
  }, [date, startWeekOn]);
  const previousDate = useCallback(() => {
    const day = getLastDaysInMonth(
      previousMonth(date),
      getNumberOfDay(getFirstDayInMonth(date).ddd, startWeekOn)
    );
  }, [date, startWeekOn]);
  const current = useCallback(() => {
    return getDaysInMonth(formatDate(date));
  }, [date]);

  const next = useCallback(() => {
    return getFirstDaysInMonth(
      previousMonth(date),
      CALENDAR_SIZE - (previous().length + current().length)
    );
  }, [current, date, previous]);

  const hideMonths = useCallback(() => {
    showMonths && setShowMonths(false);
  }, [showMonths]);

  const hideYears = useCallback(() => {
    showYears && setShowYears(false);
  }, [showYears]);

  const clickMonth = useCallback(
    (month: number) => {
      setTimeout(() => {
        changeMonth(month);
        if (mode === "daily") {
          setShowMonths(!showMonths);
        } else {
          hideDatepicker();
          clickDay(1, month, date.year());
        }
      }, 250);
    },
    [changeMonth, showMonths]
  );

  const clickYear = useCallback(
    (year: number) => {
      setTimeout(() => {
        changeYear(year);
        setShowYears(!showYears);
        if (mode === "monthly") {
          setShowMonths(true);
          clickDay(1, date.month() + 1, year);
        }
      }, 250);
    },
    [changeYear, showYears]
  );

  const clickDay = useCallback(
    (day: number, month = date.month() + 1, year = date.year()) => {
      const fullDay = `${year}-${month}-${day}`;
      let newStart;
      let newEnd = null;
      function chosePeriod(start: string, end: string) {
        const ipt = input?.current;
        changeDatepickerValue(
          {
            startDate: dayjs(start).format(DATE_FORMAT),
            endDate: dayjs(end).format(DATE_FORMAT),
          },
          ipt
        );
        hideDatepicker();
      }

      if (period.start && period.end) {
        if (changeDayHover) {
          changeDayHover(null);
        }
        changePeriod({
          start: null,
          end: null,
        });
      }

      if ((!period.start && !period.end) || (period.start && period.end)) {
        if (!period.start && !period.end) {
          changeDayHover(fullDay);
        }
        newStart = fullDay;
        if (asSingle) {
          newEnd = fullDay;
          chosePeriod(fullDay, fullDay);
        }
      } else {
        if (period.start && !period.end) {
          // start not null
          // end null
          const condition =
            dayjs(fullDay).isSame(dayjs(period.start)) ||
            dayjs(fullDay).isAfter(dayjs(period.start));
          newStart = condition ? period.start : fullDay;
          newEnd = condition ? fullDay : period.start;
        } else {
          // Start null
          // End not null
          const condition =
            dayjs(fullDay).isSame(dayjs(period.end)) ||
            dayjs(fullDay).isBefore(dayjs(period.end));
          newStart = condition ? fullDay : period.start;
          newEnd = condition ? period.end : fullDay;
        }

        if (!showFooter) {
          if (newStart && newEnd) {
            chosePeriod(newStart, newEnd);
          }
        }
      }

      if (!(newEnd && newStart) || showFooter) {
        changePeriod({
          start: newStart,
          end: newEnd,
        });
      }
    },
    [
      asSingle,
      changeDatepickerValue,
      changeDayHover,
      changePeriod,
      date,
      hideDatepicker,
      period.end,
      period.start,
      showFooter,
      input,
    ]
  );

  const clickPreviousDays = useCallback(
    (day: number) => {
      const newDate = previousMonth(date);
      clickDay(day, newDate.month() + 1, newDate.year());
      onClickPrevious();
    },
    [clickDay, date, onClickPrevious]
  );

  const clickNextDays = useCallback(
    (day: number) => {
      const newDate = nextMonth(date);
      clickDay(day, newDate.month() + 1, newDate.year());
      onClickNext();
    },
    [clickDay, date, onClickNext]
  );

  // UseEffects & UseLayoutEffect
  useEffect(() => {
    setYear(date.year());
  }, [date]);

  const getMonth = (month?: string) => {
    const value: any = date;
    const currentDate: any = new Date(value);
    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setDate(1);
    switch (month) {
      case "before":
        previousMonthDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "after":
        previousMonthDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        break;
    }
    return previousMonthDate;
  };
  // Variables
  const calendarData = useMemo(() => {
    const data = {
      previous: previous(),
      current: current(),
      next: next(),
    };
    const result = {
      date: date,
      days: data,
      time: {
        previous: data?.previous?.length
          ? data.previous.map((e) => {
              return new Date(
                getMonth("before").getFullYear(),
                getMonth("before").getMonth(),
                e
              );
            })
          : [],
        current: data?.current?.length
          ? data.current.map((e) => {
              return new Date(
                getMonth().getFullYear(),
                getMonth().getMonth(),
                e
              );
            })
          : [],
        next: data?.next?.length
          ? data.next.map((e) => {
              return new Date(
                getMonth("after").getFullYear(),
                getMonth("after").getMonth(),
                e
              );
            })
          : [],
      },
    };
    return result;
  }, [current, date, next, previous]);
  useEffect(() => {
    if (typeof onLoad === "function") {
      const run = async () => {
        if (typeof onLoad === "function") {
          const param = dayjs(formatDate(date)).toDate();
          await onLoad({
            date: param,
            calender: calendarData,
          });
        }
      };
      run();
    }
  }, [calendarData, date]);
  const minYear = React.useMemo(
    () => (minDate && dayjs(minDate).isValid() ? dayjs(minDate).year() : null),
    [minDate]
  );
  const maxYear = React.useMemo(
    () => (maxDate && dayjs(maxDate).isValid() ? dayjs(maxDate).year() : null),
    [maxDate]
  );
  const isCustom = style === "custom";

  return (
    <div
      className={cx(
        "w-full md:w-[296px] md:min-w-[296px] calender",
        isCustom && "flex-grow"
      )}
    >
      <div
        className={cx(
          "flex items-stretch ",
          isCustom ? "" : "space-x-1.5 px-2 py-1.5 flex-col",
          css`
            border-bottom: 1px solid #d1d5db;
          `
        )}
      >
        {style === "custom" ? (
          <div className="flex flex-row items-center px-2 py-2 justify-between w-full">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="flex flex-row gap-x-2">
                <button
                  type="button"
                  onClick={onClickPrevious}
                  className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClickNext}
                  className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="text-base font-semibold text-gray-900 capitalize flex flex-row">
                {calendarData.date.locale(i18n).format("MMMM")}{" "}
                {calendarData.date.year()}
              </div>
            </div>
            <div></div>
          </div>
        ) : (
          <div>
            {!showMonths && !showYears && (
              <div className="flex-none">
                <RoundedButton roundedFull={true} onClick={onClickPrevious}>
                  <ChevronLeftIcon className="h-5 w-5" />
                </RoundedButton>
              </div>
            )}

            {showYears && (
              <div className="flex-none">
                <RoundedButton
                  roundedFull={true}
                  onClick={() => {
                    setYear(year - 12);
                  }}
                >
                  <DoubleChevronLeftIcon className="h-5 w-5" />
                </RoundedButton>
              </div>
            )}

            <div className=" flex flex-1 items-stretch space-x-1.5">
              <div className="w-1/2 flex items-stretch">
                <RoundedButton
                  onClick={() => {
                    setShowMonths(!showMonths);
                    hideYears();
                  }}
                >
                  <>{calendarData.date.locale(i18n).format("MMM")}</>
                </RoundedButton>
              </div>

              <div className="w-1/2 flex items-stretch">
                <RoundedButton
                  onClick={() => {
                    setShowYears(!showYears);
                    hideMonths();
                  }}
                >
                  <div className="py-2">{calendarData.date.year()}</div>
                </RoundedButton>
              </div>
            </div>

            {showYears && (
              <div className="flex-none">
                <RoundedButton
                  roundedFull={true}
                  onClick={() => {
                    setYear(year + 12);
                  }}
                >
                  <DoubleChevronRightIcon className="h-5 w-5" />
                </RoundedButton>
              </div>
            )}

            {!showMonths && !showYears && (
              <div className="flex-none">
                <RoundedButton roundedFull={true} onClick={onClickNext}>
                  <ChevronRightIcon className="h-5 w-5" />
                </RoundedButton>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={cx(
          isCustom ? "flex-grow" : "min-h-[285px]",
          "mt-0.5  calender-body"
        )}
      >
        {showMonths && (
          <Months
            currentMonth={calendarData.date.month() + 1}
            clickMonth={clickMonth}
            style={style}
          />
        )}

        {showYears && (
          <Years
            year={year}
            minYear={minYear}
            maxYear={maxYear}
            currentYear={calendarData.date.year()}
            clickYear={clickYear}
          />
        )}

        {!showMonths && !showYears && (
          <>
            <Week style={style} />

            <Days
              calendarData={calendarData}
              onClickPreviousDays={clickPreviousDays}
              onClickDay={clickDay}
              onClickNextDays={clickNextDays}
              style={style}
              onIcon={(day, date, data) => {
                if (typeof onMark === "function") {
                  return onMark(day, date, data);
                }
                return <></>;
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
