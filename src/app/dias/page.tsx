"use client";

import { useEffect, useMemo, useState } from "react";

import { TrainingDayCard } from "@/components/training-day-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Calendar, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import getDays from "@/feature/plan/actions/getDays";
import { Weekday } from "@/generated/prisma/browser";
import { dayType, planType } from "@/feature/plan/type/plan.type";
import DialogForm from "@/feature/plan/ui/DialogForm";
import { Card } from "@/components/ui/card";
import getTodayName from "@/utilts/getTodayName";

export default function TrainingDaysPage() {
  const [days, setDays] = useState<dayType[] | null>(null);
  const [plans, setPlans] = useState<planType[] | null>(null);

  const [isLoadingDays, setIsLoadingDays] = useState(true);
  const [openDay, setOpenDay] = useState<Weekday | null>(getTodayName()); // o null si querés todo cerrado
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<dayType | null>(null);

  // 🔴 Cambiamos de exercises: string[] a exerciseBlocks: string[][]
  const [formData, setFormData] = useState<{
    name: string;
    day: Weekday;
    exerciseBlocks: string[][];
    blockTitles: string[];
  }>({
    name: "",
    day: "lunes" as Weekday,
    exerciseBlocks: [[]], // bloque 1 por defecto
    blockTitles: ["Bloque 1"], // titulo por defecto
  });
  type DayItem = {
    planId: string;
    planName: string;
    isActive: boolean;
    day: dayType; // este es el PlanDay (tu dayType)
  };
  const toggleDay = (wd: Weekday) => {
    setOpenDay((prev) => (prev === wd ? null : wd));
  };

  const groupedByWeekday = useMemo(() => {
    const initial: Record<Weekday, DayItem[]> = {
      [Weekday.lunes]: [],
      [Weekday.martes]: [],
      [Weekday.miercoles]: [],
      [Weekday.jueves]: [],
      [Weekday.viernes]: [],
      [Weekday.sabado]: [],
      [Weekday.domingo]: [],
    };

    if (!plans) return initial;

    for (const plan of plans) {
      for (const d of plan.days) {
        initial[d.day].push({
          planId: plan.id,
          planName: plan.name,
          isActive: plan.isActive,
          day: d,
        });
      }
    }

    // ordenar: primero planes activos, luego nombre plan
    (Object.keys(initial) as Weekday[]).forEach((k) => {
      initial[k].sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.planName.localeCompare(b.planName);
      });
    });

    return initial;
  }, [plans]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoadingDays(true);
        const list = await getDays(); // planType[]
        if (!cancelled) setPlans(list as planType[]);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoadingDays(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenDialog = (day?: dayType) => {
    if (day) {
      setEditingDay(day);

      const sortedBlocks = [...day.blocks].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );

      setFormData({
        name: day.name,
        day: day.day,
        exerciseBlocks: sortedBlocks.map((b) =>
          [...b.exercises]
            .sort((x, y) => (x.order ?? 0) - (y.order ?? 0))
            .map((e) => e.exerciseId),
        ),
        blockTitles: sortedBlocks.map((b) => b.title),
      });
    } else {
      setEditingDay(null);
      setFormData({
        name: "",
        day: Weekday.lunes,
        exerciseBlocks: [[]],
        blockTitles: ["Bloque 1"],
      });
    }
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este día de entrenamiento?")) {
      // Ojo: vos venías usando deleteTrainingDay local.
      // Acá deberías llamar a tu server action para borrar, o refrescar la lista luego.
      // deleteTrainingDay(id);
      console.warn("Implementar delete server action para:", id);
    }
  };
  const WEEKDAY_ORDER: Weekday[] = [
    Weekday.lunes,
    Weekday.martes,
    Weekday.miercoles,
    Weekday.jueves,
    Weekday.viernes,
    Weekday.sabado,
    Weekday.domingo,
  ];

  const weekdayLabel: Record<Weekday, string> = {
    [Weekday.lunes]: "Lunes",
    [Weekday.martes]: "Martes",
    [Weekday.miercoles]: "Miércoles",
    [Weekday.jueves]: "Jueves",
    [Weekday.viernes]: "Viernes",
    [Weekday.sabado]: "Sábado",
    [Weekday.domingo]: "Domingo",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-xl"
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>

              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Planes de Entrenamiento
                </h1>
                {isLoadingDays ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {days?.length} planes creados
                  </p>
                )}
              </div>
            </div>
            {/* <DialogForm /> */}
            <DialogForm
              isOpen={false}
              onOpenChange={setDialogOpen}
              editingDay={null}
            />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {WEEKDAY_ORDER.map((wd) => {
          const items = groupedByWeekday[wd];
          const count = items.length;
          const isOpen = openDay === wd;

          return (
            <Card
              key={wd}
              className="group bg-card border border-border hover:border-primary/50 transition-colors rounded-2xl overflow-hidden my-6"
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => toggleDay(wd)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleDay(wd);
              }}
            >
              {/* HEADER del día (siempre visible) */}
              <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-primary/10">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
                      {weekdayLabel[wd]}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {count} {count === 1 ? "plan" : "planes"}
                    </p>
                  </div>
                </div>

                {/* Flecha */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-xl hover:bg-primary/10"
                  aria-label={isOpen ? "Cerrar" : "Abrir"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDay(wd);
                  }}
                >
                  <ChevronRight
                    className={[
                      "w-5 h-5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                      isOpen ? "rotate-90" : "rotate-0",
                    ].join(" ")}
                  />
                </Button>
              </div>

              {/* BODY (solo si está abierto) */}
              {isOpen ? (
                <div className="px-4 sm:px-5 pb-5">
                  {count === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                      No hay planes asignados a {weekdayLabel[wd].toLowerCase()}
                      .
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={`${item.planId}-${item.day.id}`}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              Plan:{" "}
                              <span className="text-foreground/80">
                                {item.planName}
                              </span>
                              {item.isActive ? " (activo)" : ""}
                            </p>
                          </div>

                          {/* Importante: evitar que click dentro cierre el accordion */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <TrainingDayCard
                              day={item.day}
                              onSelect={() => handleOpenDialog(item.day)}
                              isActive={item.isActive}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
