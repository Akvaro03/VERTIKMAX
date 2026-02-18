"use client";

import * as React from "react";
import { Copy, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Skeleton } from "./ui/skeleton";

import { planType } from "@/feature/plan/type/plan.type";
import getOnePlanByID from "@/feature/plan/actions/getOnePlanByID";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planData?: planType;
  planId?: string;
};

export default function DialogTranscription({
  isOpen,
  onOpenChange,
  planData,
  planId,
}: Props) {
  const [planSelected, setPlanSelected] = React.useState<planType | null>(
    planData ?? null,
  );
  const openAllDays = React.useMemo(
    () => (planSelected?.days ?? []).map((d) => d.id),
    [planSelected?.days],
  );

  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >(planData ? "success" : "idle");

  // Limpieza + carga
  React.useEffect(() => {
    if (!isOpen) return;

    // Si ya viene data, no fetch
    if (planData) {
      setPlanSelected(planData);
      setStatus("success");
      return;
    }

    if (!planId) return;

    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const plan = await getOnePlanByID({ planId });
        if (!cancelled) {
          setPlanSelected(plan);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) setStatus("error");
        console.log(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, planId, planData]);

  const close = () => onOpenChange(false);

  const plainText = React.useMemo(() => {
    if (!planSelected) return "";
    const lines: string[] = [];
    lines.push(`Plan: ${planSelected.name ?? "Sin nombre"}`);
    for (const d of planSelected.days ?? []) {
      lines.push(`\n${d.name ?? "Día"}`);
      for (const b of d.blocks ?? []) {
        lines.push(`  - ${b.title ?? "Bloque"}`);
        for (const e of b.exercises ?? []) {
          lines.push(
            `      • ${e.exercise?.name ?? "Ejercicio"} — ${e.targetSets ?? "—"}x${e.targetReps ?? "—"}`,
          );
        }
      }
    }
    return lines.join("\n");
  }, [planSelected]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      // si tenés sonner/toast -> toast.success("Copiado")
    } catch {
      // fallback si clipboard falla
      // toast.error("No se pudo copiar")
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            // handleDelete(day.id);
          }}
          className={[
            "bg-background/70 backdrop-blur border rounded-xl shadow-sm",
            "text-violet-600 hover:bg-violet-500/10",
          ].join(" ")}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={[
          // Mobile-first: full-ish, cómodo
          "p-0 overflow-hidden",
          "w-[95vw] max-w-[95vw] sm:max-w-lg lg:max-w-3xl",
          "bg-card border-border",
        ].join(" ")}
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-card/90 backdrop-blur border-b border-border">
          <DialogHeader className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-base sm:text-lg">
                Resumen del plan
              </DialogTitle>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={handleCopy}
                  disabled={!plainText || status !== "success"}
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={close}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subheader */}
            {status === "success" ? (
              <div className="mt-2">
                <p className="text-sm font-medium text-foreground break-words">
                  {planSelected?.name ?? "Plan sin nombre"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {planSelected?.days?.length ?? 0} días
                </p>
              </div>
            ) : null}
          </DialogHeader>
        </div>

        {/* Body scroll */}
        <ScrollArea className="max-h-[75vh]">
          <div className="px-4 py-4">
            {status === "loading" ? (
              <LoadingSkeleton />
            ) : status === "error" ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive">
                  No se pudo cargar el plan.
                </p>
                <Button variant="outline" onClick={() => onOpenChange(true)}>
                  Reintentar
                </Button>
              </div>
            ) : !planSelected ? (
              <p className="text-sm text-muted-foreground">
                No hay información para mostrar.
              </p>
            ) : (
              <Accordion
                type="multiple"
                className="space-y-2"
                defaultValue={openAllDays}
              >
                {(planSelected.days ?? []).map((d) => (
                  <AccordionItem
                    key={d.id}
                    value={d.id}
                    className="rounded-xl border border-border/60 px-3"
                  >
                    <AccordionContent className="pb-3">
                      <div className="space-y-3">
                        {(d.blocks ?? []).map((b) => (
                          <div
                            key={b.id}
                            className="rounded-xl bg-background/40 border border-border/50 p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-secondary/40 border-0 text-[11px] shrink-0"
                              >
                                {String(d.day ?? "").toUpperCase() || "DÍA"}
                              </Badge>

                              <p className="text-sm font-semibold break-words">
                                {b.title ?? "Bloque"}
                              </p>
                            </div>

                            <Separator className="my-2" />

                            <div className="space-y-2">
                              {(b.exercises ?? []).map((e) => (
                                <div
                                  key={e.id}
                                  className="flex items-start justify-between gap-3"
                                >
                                  <p className="text-sm text-muted-foreground flex-1 min-w-0 break-words">
                                    {e.exercise?.name ?? "Ejercicio"}
                                  </p>

                                  <Badge
                                    variant="secondary"
                                    className="bg-secondary/40 border-0 text-[11px] shrink-0"
                                  >
                                    {e.targetSets ?? "—"}×{e.targetReps ?? "—"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </ScrollArea>

        {/* Footer sticky (mobile UX) */}
        <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur px-4 py-3">
          <Button
            className="w-full rounded-xl"
            onClick={handleCopy}
            disabled={!plainText || status !== "success"}
          >
            Copiar resumen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
