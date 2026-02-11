"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import getPlans from "@/feature/plan/actions/getPlans";
import type { planType } from "@/feature/plan/type/plan.type";
import DialogForm from "@/feature/plan/ui/DialogForm";
import PlanCard from "@/components/Plan-card";

export default function TrainingDaysPage() {
  const [plans, setPlans] = useState<planType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const list = await getPlans(); // <- planType[]
        if (!cancelled) setPlans(list as planType[]);
      } catch (e) {
        console.error(e);
        if (!cancelled) setPlans([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const plansSorted = useMemo(() => {
    if (!plans) return null;
    return [...plans].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [plans]);

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
                {isLoading ? (
                  <Skeleton className="h-3 w-24 mt-1" />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {plansSorted?.length ?? 0} planes
                  </p>
                )}
              </div>
            </div>

            <DialogForm
              isOpen={dialogOpen}
              onOpenChange={setDialogOpen}
              editingDay={null}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
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
        ) : !plansSorted || plansSorted.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Dumbbell className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                No hay planes
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto text-balance">
                Crea tu primer plan para organizar tus entrenamientos.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {plansSorted.map((plan, key) => (
              <div className="relative group" key={key}>
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
