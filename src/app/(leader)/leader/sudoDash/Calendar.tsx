'use client'
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
export default function Calendario() {
    const [date, setDate] = useState<Date>()
  return (
    <div className="text-black">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    </div>
  );
}
