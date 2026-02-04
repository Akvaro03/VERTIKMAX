"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Settings, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import getToday from "@/feature/plan/actions/getToday";
import { TrainingDayCard } from "@/components/training-day-card";
import { dayType, planType } from "@/feature/plan/type/plan.type";

export default function Home() {
  const [days, setDays] = useState<dayType[] | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const list = await getToday();
        const dayList = list.map((day) => day.days).flat();
        setDays(dayList as dayType[]);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Mis Entrenamientos
                </h1>
                <p className="text-xs text-muted-foreground">
                  {/* {exercises?.length} ejercicios */}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dias">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl bg-transparent"
                >
                  <Calendar className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/ejercicios">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl bg-transparent"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {days === null ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Dumbbell className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                No hay ejercicios
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto text-balance">
                Agrega tus primeros ejercicios para comenzar a registrar tus
                entrenamientos
              </p>
            </div>
            <Link href="/ejercicios">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                Agregar Ejercicios
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {days?.map((day, key) => (
              <div className="relative group" key={key}>
                <TrainingDayCard
                  day={day}
                  onSelect={(d) => console.log(d)}
                  isActive
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <LogWorkoutDialog
        exercise={selectedExercise}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      /> */}
    </div>
  );
}
