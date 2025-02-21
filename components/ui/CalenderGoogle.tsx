import { FC, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RoundedButton,
} from "./Datepicker/components/utils";
import { monthYearDate } from "@/lib/utils/date";
export const CalenderGoogle: FC<{}> = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [now, setNow] = useState(new Date());
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
                const allEvents = info.allSegs.map(
                  (seg: any) =>
                    seg.eventRange.def.extendedProps || seg.eventRange.def
                );
                // setMoreEvents(allEvents);
                // setShowMorePopup(true);
                console.log(allEvents);
                return "none"; // Mencegah FullCalendar pindah ke tampilan hari
              }}
              // Ketika klik event
              eventClick={(info: any) => {
                const event = info?.event?.extendedProps;
                console.log({ event });
                // setSelectedEvent(info.event);
                // setShowEventPopup(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
