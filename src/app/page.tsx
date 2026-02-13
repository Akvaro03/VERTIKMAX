"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { TrainingDayCard } from "@/components/training-day-card";
import { dayType, planType } from "@/feature/plan/type/plan.type";
import { WeekdaySelect } from "@/components/selectDat";
import getTodayName from "@/utilts/getTodayName";
import { Weekday } from "@/generated/prisma/enums";
import { Spinner } from "@/components/ui/spinner";
import getDashboardHome from "@/feature/plan/actions/getDashboardHome";

type DayWithPlanActive = dayType & { planIsActive: boolean };

export default function Home() {
  const [days, setDays] = useState<DayWithPlanActive[]>([]);
  const [daySelected, SetDaySelected] = useState<Weekday>(getTodayName());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const list = (await getDashboardHome({
          day: daySelected,
        })) as planType[];
        const dayList: DayWithPlanActive[] = list.flatMap((plan) =>
          plan.days.map((day) => ({ ...day, planIsActive: plan.isActive })),
        );
        setDays(dayList);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [reloadKey, daySelected]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Mis Entrenamientos
                </h1>
                <p className="text-xs text-muted-foreground">
                  {days?.length} planes
                </p>
              </div>
              <WeekdaySelect value={daySelected} onChange={SetDaySelected} />
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

      <div className="max-w-2xl lg:max-w-none mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Spinner />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Cargando
              </h2>
            </div>
          </div>
        ) : days === null ? (
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
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {days?.map((day, key) => (
              <div
                key={key}
                className="relative group w-full max-w-2xl mx-auto"
              >
                <TrainingDayCard
                  day={day}
                  isActive={day.planIsActive}
                  onReload={reload}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
