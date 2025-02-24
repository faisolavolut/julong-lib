import { FC, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RoundedButton,
} from "./Datepicker/components/utils";
import { dayDate, monthYearDate } from "@/lib/utils/date";
import { X } from "lucide-react";
interface PopupPos {
  x: number;
  y: number;
}
export const CalenderGoogle: FC<{}> = () => {
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
  const [events, setEvents] = useState([
    {
      title: "Meeting",
      start: "2025-02-25T10:00:00",
      end: "2025-02-25T11:00:00",
      allDay: true,
      color: "#2196f3",
      extendedProps: {
        id: 1,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-26T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 2,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-24T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
    {
      title: "Lunch Break",
      start: "2025-02-22T12:00:00",
      end: "2025-02-28T12:00:00",
      allDay: true,
      color: "#ff5722",
      extendedProps: {
        id: 3,
      },
    },
  ]);
  return (
    <div className="flex flex-col w-full h-full">
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
              moreLinkClick={(info: any) => {
                console.log(info.allSegs);
                const clickedDate = info.date;
                setDetailDate(clickedDate);
                console.log("Tanggal yang diklik:", clickedDate);
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
                const event = info?.event?.extendedProps;
                // setSelectedEvent(info.event);
                // setShowEventPopup(true);
              }}
            />
            {showPopup && (
              <CenteredPopup
                onClose={() => setShowPopup(false)}
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
        console.log("CEKKK");
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
        zIndex: 9999,
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
