import { FC, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RoundedButton,
} from "./Datepicker/components/utils";
import { dayDate, formatDay, monthYearDate } from "@/lib/utils/date";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Calender } from "@/lib/svg/Calender";
interface PopupPos {
  x: number;
  y: number;
}
export const CalenderGoogle: FC<{ events: any[] }> = ({ events }) => {
  const [showDialog, setShowDialog] = useState(false as boolean);
  const [canClose, setCanClose] = useState(true as boolean);
  const [detailDialog, setDetailDialog] = useState({
    title: "Judul",
    start: new Date(),
    end: new Date(),
    allDay: true,
    color: "#2196f3",
    extendedProps: {
      id: 1,
      pic: [
        { id: 1, name: "Karyawan 1" },
        { id: 2, name: "Karyawan 2" },
        { id: 3, name: "Karyawan 3" },
      ],
    },
  } as any);
  const calendarRef = useRef<FullCalendar>(null);
  const [popupPos, setPopupPos] = useState<PopupPos>({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [listMore, setListMore] = useState([] as any[]);
  const [now, setNow] = useState(new Date());
  const [detailDate, setDetailDate] = useState(new Date());
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    setNow(calendarApi?.getDate() || new Date());
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    setNow(calendarApi?.getDate() || new Date());
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };
  const joinDayString = (day1: any, day2: any, split?: string) => {
    const label = day1 || day2;
    if (day1 && day2) {
      return `${day1} ${split || "-"} ${day2}`;
    }
    return label;
  };
  const joinString = (data: any[], split?: string) => {
    const label = data?.length ? data.map((e) => e?.name) : [];
    return label.join(`${split || " ,"}`);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <Dialog
        open={showDialog}
        onOpenChange={(e) => {
          setShowDialog(e);
          setTimeout(() => {
            setCanClose(true);
          }, 100);
        }}
      >
        <DialogContent
          className={cx(
            " flex flex-col w-1/2",
            css`
              max-width: 100vw;
            `
          )}
          onClick={() => {
            setShowDialog(false);
            setTimeout(() => {
              setCanClose(true);
            }, 100);
          }}
        >
          <DialogHeader>
            <DialogTitle>Event</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="flex items-center flex-col flex-grow ">
            <div className="w-full  flex flex-col flex-grow bg-white overflow-hidden ">
              <div className=" py-4 px-0 rounded-lg  max-w-sm">
                <div className="flex items-center gap-2">
                  <div className="w-[15px] h-[15px] bg-red-500 rounded-md"></div>
                  <h2 className="text-lg font-semibold">
                    {detailDialog.title || "No title"}
                  </h2>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="w-[15px] h-[15px] bg-transparent rounded-md"></div>
                  <p className="text-gray-500 text-sm">
                    {formatDay(detailDialog?.start, "YYYY") ===
                    formatDay(detailDialog?.end, "YYYY")
                      ? joinDayString(
                          formatDay(detailDialog?.start, "DD MMMM"),
                          formatDay(detailDialog?.end, "DD MMMM, YYYY")
                        )
                      : joinDayString(
                          formatDay(detailDialog?.start, "DD MMMM YYYY"),
                          formatDay(detailDialog?.end, "DD MMMM YYYY")
                        )}
                  </p>
                </div>
                {detailDialog?.extendedProps?.pic?.length ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Calender className="w-5 h-5 text-gray-600" />
                    <p className="text-gray-700 font-medium text-md">
                      {joinString(detailDialog?.extendedProps?.pic)}
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row gap-x-1 py-2 items-center">
        <div className="flex flex-row gap-x-1 p-2">
          <RoundedButton roundedFull={true} onClick={handlePrev}>
            <ChevronLeftIcon className="h-5 w-5 p-0.5" />
          </RoundedButton>
          <RoundedButton roundedFull={true} onClick={handleNext}>
            <ChevronRightIcon className="h-5 w-5 p-0.5" />
          </RoundedButton>
        </div>
        <div className="text-base font-semibold text-gray-900 capitalize flex flex-row">
          {monthYearDate(now)}
        </div>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-grow h-full relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <FullCalendar
              ref={calendarRef}
              headerToolbar={false}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="100%"
              dayMaxEventRows={2}
              // expandRows={false}
              // Ketika klik “+ X more”
              // dayMaxEventRows={true}
              dayCellClassNames={(arg) => {
                return formatDay(arg.date, "DD MMMM YYYY") ===
                  formatDay(new Date(), "DD MMMM YYYY")
                  ? cx(
                      "!bg-transparent ",
                      css`
                        .fc-daygrid-day-number {
                        }
                      `
                    )
                  : "";
              }}
              dayCellContent={(arg) => {
                const isToday =
                  formatDay(arg.date, "DD MMMM YYYY") ===
                  formatDay(new Date(), "DD MMMM YYYY");
                return (
                  <span
                    className={
                      isToday
                        ? "text-white bg-primary rounded-full p-1 text-sm font-bold"
                        : ""
                    }
                  >
                    {arg.dayNumberText}
                  </span>
                );
              }}
              moreLinkClick={(info: any) => {
                const clickedDate = info.date;
                setDetailDate(clickedDate);
                const allEvents = info.allSegs.map(
                  (seg: any) =>
                    seg?.eventRange?.def?.extendedProps || seg?.eventRange?.def
                );
                const linkRect = info.jsEvent.target.getBoundingClientRect();
                setPopupPos({
                  x: linkRect.left + window.scrollX,
                  y: linkRect.top + window.scrollY,
                });
                const list = [] as any[];
                info.allSegs.map((info: any) => {
                  const event = info?.event;
                  list.push(event);
                });
                setListMore(list);
                setShowPopup(true);
                return "none"; // Mencegah FullCalendar pindah ke tampilan hari
              }}
              // Ketika klik event
              eventClick={(info: any) => {
                const event = info?.event;

                setDetailDialog(event);
                setShowDialog(true);
                setCanClose(true);
                // setSelectedEvent(info.event);
                // setShowEventPopup(true);
              }}
            />
            {showPopup && (
              <CenteredPopup
                onClose={() => {
                  if (canClose) {
                    setShowPopup(false);
                  }
                }}
                popupPos={popupPos}
              >
                <div className="flex flex-col gap-y-1">
                  <div className="flex flex-row gap-x-2">
                    <div className="flex flex-grow font-bold text-md">
                      {dayDate(detailDate)}
                    </div>
                    <div
                      className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                      onClick={() => setShowPopup(false)}
                    >
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-1">
                      {listMore.map((evt, idx) => (
                        <div
                          key={idx}
                          className="bg-red-500 text-sm px-2 rounded-md text-white cursor-pointer"
                          onClick={() => {
                            setDetailDialog(evt);
                            setShowDialog(true);
                            setCanClose(false);
                          }}
                        >
                          {evt?.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-y-1"></div>
                </div>
              </CenteredPopup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
interface CenteredPopupProps {
  children: React.ReactNode;
  onClose: () => void;
  popupPos: PopupPos;
}
const CenteredPopup: React.FC<CenteredPopupProps> = ({
  children,
  onClose,
  popupPos,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({
    top: popupPos.y,
    left: popupPos.x,
  });
  const [classname, setClassname] = useState(null as any);
  useEffect(() => {
    setClassname(css`
      top: ${popupPos.y}px;
      left: ${popupPos.x}px;
      transform: translate(-50%, -50%);
    `);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  useEffect(() => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      let newY = popupPos.y;
      let newX = popupPos.x;

      // Jika bagian bawah popup melebihi tinggi viewport, geser ke atas
      if (newY + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height - 10; // beri margin 10px
        setClassname(css`
          bottom: 0;
          left: ${popupPos.x}px;
          transform: translateX(-50%);
        `);
      }
    }
  }, [popupPos]);
  return (
    <div
      className={cx("shadow-md rounded-lg", classname)}
      style={{
        position: "fixed",
        // top: adjustedPos.y,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <div
        ref={popupRef}
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "90%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
