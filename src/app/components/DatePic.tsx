"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DateTimePickerProps = {
  labelTitle?: string
  /** Valor combinado (local) */
  value?: Date;
  /** Dispara quando data/hora mudarem */
  onChange?: (dt: Date | undefined) => void;
  /** Horário inicial (HH:mm[:ss]) usado quando escolher só a data */
  defaultTime?: string; // ex: "19:30" ou "19:30:00"
  /** Passo dos segundos no input type=time */
  stepSeconds?: number; // ex: 1
  /** Desabilita o componente */
  disabled?: boolean;
  /** Id base pros inputs (acessibilidade) */
  idBase?: string;
  /** Placeholder quando sem data */
  datePlaceholder?: string;
  /** Se true, mostra segundos no input time */
  showSeconds?: boolean;
  className?: string;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function parseTimeString(time?: string) {
  // aceita "HH:mm" ou "HH:mm:ss"
  if (!time) return { h: 0, m: 0, s: 0 };
  const [h, m, s] = time.split(":").map(Number);
  return { h: h ?? 0, m: m ?? 0, s: s ?? 0 };
}

function timeFromDate(d: Date | undefined, showSeconds: boolean) {
  if (!d) return showSeconds ? "00:00:00" : "00:00";
  const h = pad2(d.getHours());
  const m = pad2(d.getMinutes());
  const s = pad2(d.getSeconds());
  return showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}

function mergeDateAndTime(date: Date, time: string) {
  const { h, m, s } = parseTimeString(time);
  const merged = new Date(date);
  merged.setHours(h, m, s ?? 0, 0);
  return merged;
}

export function DateTimePicker({
  labelTitle,
  value,
  onChange,
  defaultTime = "19:30",
  stepSeconds = 1,
  disabled,
  idBase = "dt",
  datePlaceholder = "Selecionar data",
  showSeconds = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [innerDate, setInnerDate] = React.useState<Date | undefined>(value);
  const [innerTime, setInnerTime] = React.useState<string>(
    value ? timeFromDate(value, showSeconds) : (showSeconds && defaultTime.length === 5 ? `${defaultTime}:00` : defaultTime)
  );

  // Sincroniza quando value externo mudar
  React.useEffect(() => {
    setInnerDate(value);
    setInnerTime(timeFromDate(value, showSeconds));
  }, [value, showSeconds]);

  // Aplica mudança consolidada
  const emitChange = React.useCallback(
    (d: Date | undefined, t: string) => {
      if (!onChange) return;
      if (!d) {
        onChange(undefined);
        return;
      }
      onChange(mergeDateAndTime(d, t));
    },
    [onChange]
  );

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
        
        <h1>{labelTitle}</h1>
        <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor={`${idBase}-date`} className="px-1">
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${idBase}-date`}
              disabled={disabled}
              className="w-40 justify-between bg-black font-normal"
            >
              {innerDate ? innerDate.toLocaleDateString() : datePlaceholder}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden bg-black text-white p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={innerDate}
              captionLayout="dropdown"
              onSelect={(newDate) => {
                setInnerDate(newDate);
                setOpen(false);
                emitChange(newDate, innerTime || (showSeconds ? "00:00:00" : "00:00"));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor={`${idBase}-time`} className="px-1">
        </Label>
        <Input
          type="time"
          id={`${idBase}-time`}
          step={showSeconds ? stepSeconds : 60} // se mostrar segundos, permite escolher; senão, minuto em minuto
          value={innerTime}
          disabled={disabled}
          onChange={(e) => {
            const t = e.target.value;
            setInnerTime(t);
            if (innerDate) emitChange(innerDate, t);
          }}
          className="bg-black appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
      </div>
    </div>
  );
}