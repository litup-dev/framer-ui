import {
  getToday,
  getTodayDate,
  getStartOfWeek,
  getEndOfWeek,
} from "@/lib/date-utils";
import { addWeeks, format } from "date-fns";
import { ko } from "date-fns/locale";

export const getDateRange = (category: "week" | "today" | "free" | "area") => {
  const today = getTodayDate();

  if (category === "week") {
    return {
      startDate: getStartOfWeek(today),
      endDate: getEndOfWeek(today),
    };
  }

  if (category === "today") {
    const todayStr = getToday();
    return {
      startDate: todayStr,
      endDate: todayStr,
    };
  }

  return {
    startDate: getToday(),
    endDate: format(addWeeks(today, 1), "yyyy-MM-dd", { locale: ko }),
  };
};
