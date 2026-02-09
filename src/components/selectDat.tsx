"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const weekdays = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
] as const;

type WeekdayValue = (typeof weekdays)[number]["value"];

export function WeekdaySelect({
  value,
  onChange,
  placeholder = "Elegí un día",
}: {
  value?: WeekdayValue;
  onChange: (v: WeekdayValue) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as WeekdayValue)}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {weekdays.map((d) => (
          <SelectItem key={d.value} value={d.value}>
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
