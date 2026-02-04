"use client";

import { getLogsByExercise } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Dumbbell, TrendingUp } from "lucide-react";
import { Exercise } from "@/feature/exercises/actions/getExercise";

interface WorkoutCardProps {
  exercise: Exercise;
  onLogWorkout: (exercise: Exercise) => void;
}

const feelingColors = {
  easy: "text-green-500",
  moderate: "text-yellow-500",
  hard: "text-orange-500",
  "very-hard": "text-red-500",
};

const feelingLabels = {
  easy: "Fácil",
  moderate: "Moderado",
  hard: "Difícil",
  "very-hard": "Muy Difícil",
};

export function WorkoutCard({ exercise, onLogWorkout }: WorkoutCardProps) {
  const logs = getLogsByExercise(exercise.id);
  const lastLog = logs[0];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground text-balance">
            {exercise.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {exercise.description}
          </p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
      </div>

      {lastLog && (
        <div className="bg-secondary/50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Último registro</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-bold text-foreground">
                {lastLog.weight}
              </span>
              <span className="text-sm text-muted-foreground ml-1">kg</span>
            </div>
            <div className="text-sm text-muted-foreground">
              × {lastLog.reps} reps
            </div>
          </div>
          <div
            className={`text-sm font-medium ${feelingColors[lastLog.feeling]}`}
          >
            {feelingLabels[lastLog.feeling]}
          </div>
        </div>
      )}

      <Button
        onClick={() => onLogWorkout(exercise)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        Registrar Entrenamiento
      </Button>
    </div>
  );
}
