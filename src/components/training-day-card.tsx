"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Timer, Hash } from "lucide-react";
import { TrainingDayWithBlocks } from "@/feature/trainingDays/actions/getDays";

interface TrainingDayCardProps {
  day: TrainingDayWithBlocks;
  onSelect: (day: TrainingDayWithBlocks) => void;
}

function formatTarget(
  targetSets: number | null,
  targetReps: string | null,
  restSeconds: number | null
) {
  const sets = targetSets ? `${targetSets} sets` : "sets —";
  const reps = targetReps ? `${targetReps} reps` : "reps —";
  const rest = restSeconds ? `${restSeconds}s` : null;

  return { sets, reps, rest };
}

export function TrainingDayCard({ day, onSelect }: TrainingDayCardProps) {
  const links = [...day.blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return (
    <Card
      className="group bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer rounded-2xl"
      onClick={() => onSelect(day)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(day);
      }}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
                  {day.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex bg-secondary/50 border-0 text-xs font-medium"
                >
                  {day.day}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mt-0.5">
                {links.length} {links.length === 1 ? "ejercicio" : "ejercicios"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl hover:bg-primary/10"
            aria-label="Ver detalles"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(day);
            }}
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </div>

        {/* Body */}
        {links.length > 0 ? (
          <div className="mt-4 space-y-2">
            {links.map((link, idx) => {
              const orderNumber = (link.order ?? idx) + 1;
              const { sets, reps, rest } = formatTarget(5, ",", 5);
              const exercises = link.exercises;
              console.log(exercises);
              return (
                <div key={link.id}>
                  {link.title}
                  {exercises.map((exercise, idx) => (
                    <div
                      key={exercise.id}
                      className="flex items-start my-2 justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5 hover:bg-background/60 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Order pill */}
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/10">
                            <span className="text-xs font-semibold text-primary">
                              {idx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Name + optional description */}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {exercises[0]?.exercise.name ||
                              "Ejercicio sin nombre"}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5" />
                              {sets}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5" />
                              {reps}
                            </span>
                            {rest ? (
                              <span className="inline-flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5" />
                                descanso {rest}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Right mini badge (compact metadata) */}
                      <Badge
                        variant="secondary"
                        className="shrink-0 bg-secondary/40 border-0 text-[11px] font-medium"
                      >
                        {5} × {"10"}
                      </Badge>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
            Todavía no agregaste ejercicios a este día.
          </div>
        )}
      </div>
    </Card>
  );
}
