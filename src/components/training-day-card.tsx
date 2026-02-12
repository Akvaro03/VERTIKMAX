"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronRight,
  Timer,
  Hash,
  Trash2,
  Copy,
  Pencil,
  CheckCircle2,
  X,
} from "lucide-react";
import LoadTraining from "./loadTraining";
import { useMemo, useState } from "react";
import { dayType } from "@/feature/plan/type/plan.type";
import changeActivePlan from "@/feature/plan/actions/changeActivePlan";

interface TrainingDayCardProps {
  day: dayType;
  isActive?: boolean;
  onSelect?: (day: dayType) => void; // opcional ahora
  defaultOpen?: boolean;
  onReload?: () => void;
}

function formatTarget(
  targetSets: number | null,
  targetReps: string | null,
  restSeconds: number | null,
) {
  const sets = targetSets != null ? `${targetSets} sets` : "sets —";
  const reps = targetReps != null ? `${targetReps} reps` : "reps —";
  const rest = restSeconds != null ? `${restSeconds}s` : null;

  return { sets, reps, rest };
}

export function TrainingDayCard({
  day,
  onSelect,
  defaultOpen = false,
  isActive,
  onReload,
}: TrainingDayCardProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [isOpenLoadExercise, setIsOpenLoadExercise] = useState<boolean>(false);
  const blocks = useMemo(
    () => [...day.blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [day.blocks],
  );

  const exercisesCount = useMemo(() => {
    return blocks.reduce((acc, b) => acc + (b.exercises?.length ?? 0), 0);
  }, [blocks]);

  const toggle = () => {
    // console.log(day)
    setOpen((prev) => {
      const next = !prev;
      // Si querés que "seleccionar" sea abrir, llamalo acá cuando abre
      if (next) onSelect?.(day);
      return next;
    });
  };

  return (
    <Card
      className="group bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer rounded-2xl"
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggle();
      }}
      aria-expanded={open}
    >
      <div className="p-4 sm:p-5">
        {/* HEADER (siempre visible) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={[
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ring-1",
                isActive
                  ? "bg-primary/10 ring-primary/10"
                  : "bg-destructive/50 ring-destructive/400",
              ].join(" ")}
            >
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
                  {String(day.day).toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm text-muted-foreground mt-0.5">
                  {exercisesCount}{" "}
                  {exercisesCount === 1 ? "ejercicio" : "ejercicios"}
                </span>
                {!isActive && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-sm text-muted-foreground mt-0.5 text-red-400">
                      Desactivado
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Flecha: toggle sin que se propague */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl hover:bg-primary/10"
            aria-label={open ? "Cerrar" : "Abrir"}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            <ChevronRight
              className={[
                "w-5 h-5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                open ? "rotate-90" : "rotate-0",
              ].join(" ")}
            />
          </Button>
        </div>
        <div className={["", transition, open ? show : hide].join(" ")}>
          {isActive ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={async (e) => {
                console.log(day.planId);
                e.stopPropagation();
                // (day.id);
                await changeActivePlan({ idPlan: day.planId, newState: false });
                onReload?.();
              }}
              className={[
                baseBtn,
                "bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20",
              ].join(" ")}
            >
              {/* <CheckCircle2 className={iconCls} /> */}
              <X className={iconCls} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={async (e) => {
                e.stopPropagation();
                changeActivePlan({ idPlan: day.planId, newState: true });
                onReload?.();
              }}
              className={[
                baseBtn,
                "text-emerald-600 hover:bg-emerald-500/10",
              ].join(" ")}
            >
              <CheckCircle2 className={iconCls} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // handleEdit(day.id);
            }}
            className={[baseBtn, "text-blue-600 hover:bg-blue-500/10"].join(
              " ",
            )}
          >
            <Pencil className={iconCls} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // handleDuplicate(day.id);
            }}
            className={[baseBtn, "text-violet-600 hover:bg-violet-500/10"].join(
              " ",
            )}
          >
            <Copy className={iconCls} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // handleDelete(day.id);
            }}
            className={[
              baseBtn,
              "bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20",
            ].join(" ")}
          >
            <Trash2 className={iconCls} />
          </Button>
        </div>

        {/* BODY (solo si open) */}
        {open ? (
          blocks.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {blocks.map((block) => (
                <div key={block.id}>
                  <div className="text-sm font-semibold text-foreground/90">
                    {block.title}
                  </div>

                  <div className="mt-2 space-y-2">
                    {block.exercises.map((ex, idx) => {
                      const { sets, reps, rest } = formatTarget(
                        ex.targetSets ?? null,
                        ex.targetReps ?? null,
                        ex.restSeconds ?? null,
                      );

                      return (
                        <div
                          key={ex.id}
                          className="rounded-xl border border-border/60 bg-background/40 px-3 py-3 hover:bg-background/60 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between w-full">
                            {/* Left */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/10 shrink-0">
                                <span className="text-xs font-semibold text-primary">
                                  {idx + 1}
                                </span>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-foreground break-words line-clamp-2">
                                  {ex.exercise?.name ?? "Ejercicio sin nombre"}
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

                            {/* Right */}
                            <div className="flex flex-col gap-2 sm:items-end shrink-0 max-w-full">
                              <Badge
                                variant="secondary"
                                className="bg-secondary/40 border-0 text-[11px] font-medium"
                              >
                                {ex.targetSets ?? "—"} × {ex.targetReps ?? "—"}
                              </Badge>
                              <div className="w-full sm:w-auto max-w-full overflow-hidden">
                                <LoadTraining
                                  isOpen={isOpenLoadExercise}
                                  onOpenChange={setIsOpenLoadExercise}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
              Todavía no agregaste ejercicios a este día.
            </div>
          )
        ) : null}
      </div>
    </Card>
  );
}

const baseBtn = "bg-background/70 backdrop-blur border rounded-xl shadow-sm";
const transition = "transition-all duration-200 ease-out";

const show =
  "opacity-100 scale-100 pointer-events-auto translate-y-0 my-4 space-x-3";
const hide = "opacity-0 scale-95 pointer-events-none translate-y-1";

const iconCls = "w-4 h-4";
