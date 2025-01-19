import { v4 } from "uuid";
import { shortDate } from "./date";
import get from "lodash.get";
import { getNumber } from "./getNumber";
const mapEventsByDate = (data: any) => {
  const events = data.data;
  const calendarTimes = [
    ...get(data, "value.calender.time.previous"),
    ...get(data, "value.calender.time.current"),
    ...get(data, "value.calender.time.next"),
  ];
  const result = [] as any[];
  calendarTimes.reduce((acc: any, dateStr: any, index) => {
    const date = new Date(dateStr);
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const formattedDate = shortDate(date);
    weekStart.setDate(weekStart.getDate() - day); // Go back to Sunday
    const formattedWeekStart = shortDate(weekStart);
    result.push({
      date: date,
      eventLabel: [],
      eventWeeksLabel: [],
      event: [],
      eventWeeks: [],
      data: {
        date: formattedDate,
        week: formattedWeekStart,
      },
    });

    events.map((event: any) => {
      const uuid = v4();
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      if (date >= startDate && date <= endDate) {
        result[index].event.push({
          ...event,
          count: 1,
          uuid,
          show: false,
        });
        result[index].eventLabel.push(event.name);
        if (event) {
          const weeksDays = result.filter(
            (e) => get(e, "data.week") === formattedWeekStart
          );
          const yourDay = result.find(
            (e: any) => get(e, "data.date") === formattedDate
          );
          if (!get(weeksDays, "length")) {
            result[index].eventWeeksLabel.push(event.name);
            result[index].eventWeeks.push({
              ...event,
              count: 1,
              show: false,
              uuid,
              idx: getNumber(get(yourDay, "event.length")),
              startDate: date,
            });
          } else {
            const findFirstEvent = weeksDays.find((e) =>
              e?.eventWeeks?.find((ex: any) => ex?.id === event?.id)
            );
            if (!findFirstEvent) {
              result[index].eventWeeksLabel.push(event.name);
              result[index].eventWeeks.push({
                ...event,
                count: 1,
                idx: getNumber(get(yourDay, "event.length")),
                show: false,
                uuid,
                startDate: date,
              });
            } else {
              const yourEvent = findFirstEvent.eventWeeks.find(
                (e: any) => e?.id === event?.id
              );
              if (yourEvent) {
                yourEvent.endDate = date;
                yourEvent.count = getNumber(get(yourEvent, "count")) + 1;
              }
            }
          }
        }
      }
    });
    return acc;
  }, {});

  const dayEvent = result.filter((e) => get(e, "eventWeeks.length"));
  const listAllWeeks = [] as any[];
  dayEvent.map((e) => {
    const eventDay = e.eventWeeks;
    eventDay.map((e: any) => {
      listAllWeeks.push(e);
    });
  });
  const processEvents = (data: any[]) => {
    // Normalisasi endDate menjadi startDate jika tidak ada
    const normalizedData = data.map((item) => ({
      ...item,
      endDate: item.endDate || item.startDate,
    }));

    // Grupkan berdasarkan minggu
    const getWeekNumber = (date: string): number => {
      const d = new Date(date);
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = Math.floor(
        (d.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const groupedByWeek = new Map<number, any[]>();

    normalizedData.forEach((item) => {
      const weekNumber = getWeekNumber(item.startDate);
      if (!groupedByWeek.has(weekNumber)) {
        groupedByWeek.set(weekNumber, []);
      }
      groupedByWeek.get(weekNumber)!.push(item);
    });

    const transformed: any[] = [];

    groupedByWeek.forEach((group) => {
      // Urutkan berdasarkan durasi (endDate - startDate) dan startDate
      group.sort((a, b) => {
        const durationA =
          new Date(a.endDate!).getTime() - new Date(a.startDate).getTime();
        const durationB =
          new Date(b.endDate!).getTime() - new Date(b.startDate).getTime();

        if (durationA !== durationB) return durationB - durationA;
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });

      // Tandai hanya satu event per hari yang memiliki `show: true`
      const occupiedDays = new Set<string>();

      group.forEach((item) => {
        let shouldShow = true;

        // Tandai hari-hari dari event ini
        const currentStart = new Date(item.startDate);
        const currentEnd = new Date(item.endDate!);

        for (
          let d = new Date(currentStart);
          d <= currentEnd;
          d.setDate(d.getDate() + 1)
        ) {
          const dayKey = d.toISOString().split("T")[0];
          if (occupiedDays.has(dayKey)) {
            shouldShow = false;
            break;
          }
        }

        // Jika tidak ada konflik, tandai hari-hari ini sebagai terpakai
        if (shouldShow) {
          for (
            let d = new Date(currentStart);
            d <= currentEnd;
            d.setDate(d.getDate() + 1)
          ) {
            occupiedDays.add(d.toISOString().split("T")[0]);
          }
        }

        transformed.push({
          ...item,
          show: shouldShow,
        });
      });
    });

    return transformed;
  };
  const allDayEvent = result.filter(
    (e) => get(e, "eventWeeks.length") || get(e, "event.length")
  );
  const fill = processEventsWithIdx(listAllWeeks);
  const ids = fill.map((e) => e.uuid) as string[];
  allDayEvent.map((e) => {
    const field = ["event", "eventWeeks"];
    field.map((ex) => {
      const data = e?.[ex] || [];
      const event = data.filter((ex: any) => ids.includes(ex.uuid));
      const excludeEvent = data.filter((ex: any) => !ids.includes(ex.uuid));
      // if (event.length) {
      //   event.map((e: any) => {
      //     const fevent = fill.find((ex) => ex?.uuid === e?.uuid);
      //     if (fevent) {
      //       e.show = fevent.show;
      //       // if (fevent.show) {
      //       //   e.idx = 0;
      //       // }
      //     }
      //   });
      // }
      if (excludeEvent.length) {
        excludeEvent.map((e: any) => {
          const fevent = fill.find((ex) => ex?.id === e?.id);
          if (fevent) {
            e.idx = fevent.idx;
          }
        });
      }
    });
  });
  return result;
};

const processEventsWithIdx = (data: any[]) => {
  // Normalisasi endDate menjadi startDate jika tidak ada
  const normalizedData = data.map((item) => ({
    ...item,
    endDate: item.endDate || item.startDate,
  }));

  // Fungsi untuk mendapatkan minggu ke-n dari sebuah tanggal
  const getWeekNumber = (date: string): number => {
    const d = new Date(date);
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor(
      (d.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Grupkan berdasarkan minggu
  const groupedByWeek = new Map<number, any[]>();
  normalizedData.forEach((item) => {
    const weekNumber = getWeekNumber(item.startDate);
    if (!groupedByWeek.has(weekNumber)) {
      groupedByWeek.set(weekNumber, []);
    }
    groupedByWeek.get(weekNumber)!.push(item);
  });

  const transformed: any[] = [];
  groupedByWeek.forEach((group) => {
    // Urutkan berdasarkan durasi (endDate - startDate) dan startDate
    group.sort((a, b) => {
      const durationA =
        new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
      const durationB =
        new Date(b.endDate).getTime() - new Date(b.startDate).getTime();

      if (durationA !== durationB) return durationB - durationA; // Prioritas durasi lebih panjang
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime(); // Jika sama, urutkan berdasarkan startDate
    });

    // Tentukan idx berdasarkan hari
    const occupiedDays = new Set<string>();
    let currentIdx = 0;

    group.forEach((item) => {
      // Tandai hari-hari dari event ini
      const currentStart = new Date(item.startDate);
      const currentEnd = new Date(item.endDate);
      let isOverlapping = false;

      for (
        let d = new Date(currentStart);
        d <= currentEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const dayKey = d.toISOString().split("T")[0];
        if (occupiedDays.has(dayKey)) {
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        // Jika tidak ada tumpang tindih, tandai hari ini sebagai terpakai
        for (
          let d = new Date(currentStart);
          d <= currentEnd;
          d.setDate(d.getDate() + 1)
        ) {
          const dayKey = d.toISOString().split("T")[0];
          occupiedDays.add(dayKey);
        }
      }

      transformed.push({
        ...item,
        idx: currentIdx++,
      });
    });
  });

  return transformed;
};
export default mapEventsByDate;
