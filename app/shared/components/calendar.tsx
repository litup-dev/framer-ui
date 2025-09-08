import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const ModalCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
};

export default ModalCalendar;
