"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { TrainingDayCard } from "@/components/training-day-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Calendar, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

import getDays from "@/feature/plan/actions/getDays";
import getExercise, { Exercise } from "@/feature/exercises/actions/getExercise";
import { Weekday } from "@/generated/prisma/browser";
import { dayType } from "@/feature/plan/type/plan.type";
import DialogForm from "@/feature/plan/ui/DialogForm";

// Si tu enum Weekday usa tildes, ajustá estos values a lo que realmente sea el enum.

function DaysListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-10 w-44" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-14 w-9 rounded-xl" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-16 w-56" />
            <Skeleton className="h-16 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrainingDaysPage() {
  const [days, setDays] = useState<dayType[] | null>(null);

  const [isLoadingDays, setIsLoadingDays] = useState(true);

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoadingDays(true);
        const list = await getDays();
        const dayList = list.map((day) => day.days).flat();
        if (!cancelled) setDays(dayList as dayType[]);
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

      // Por ahora: si el día viene plano, lo ponemos en 1 solo bloque
      setFormData({
        name: day.name,
        day: day.day,
        exerciseBlocks: [
          day.blocks.flatMap((b) => b.exercises.map((e) => e.id)),
        ],
        blockTitles: ["Bloque 1"], // si luego persistís títulos, acá los cargás
      });
    } else {
      setEditingDay(null);
      setFormData({
        name: "",
        day: "lunes" as Weekday,
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
        {isLoadingDays ? (
          <DaysListSkeleton />
        ) : days?.length === 0 || !days ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                No hay días de entrenamiento
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto text-balance">
                Crea días de entrenamiento para organizar tus ejercicios por
                rutinas
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.id} className="relative group">
                <TrainingDayCard
                  day={day as dayType}
                  onSelect={(d) => handleOpenDialog(d)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
