"use client";

import { useEffect, useState } from "react";
import { type Exercise, getExercises, getTrainingDays } from "@/lib/storage";
import { WorkoutCard } from "@/components/workout-card";
import { LogWorkoutDialog } from "@/components/log-workout-dialog";
import { Button } from "@/components/ui/button";
import { Dumbbell, Settings, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import getTodayName from "@/utilts/getTodayName";
import getToday from "@/feature/trainingDays/actions/getToday";
import { TrainingDayCard } from "@/components/training-day-card";
import { TrainingDayWithExercises } from "@/feature/trainingDays/actions/getDays";

export default function Home() {
  const [days, setDays] = useState<TrainingDayWithExercises | null>(null);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleLogWorkout = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDialogOpen(true);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getToday();
        console.log(data);
        setDays(data);
      } catch (error) {
        console.log("first");
      }
    }
    fetchData();
  }, []);

  const handleSuccess = () => {
    setExercises(getExercises());
  };
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
          <div className="relative group">
            <TrainingDayCard day={days} onSelect={(d) => console.log(d)} />
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
        )}
      </div>

      <LogWorkoutDialog
        exercise={selectedExercise}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
