"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  // Si querés pedir confirmación extra tipeando una palabra.
  requireTextConfirm?: boolean;
  confirmText?: string; // default: "ELIMINAR"

  onConfirm: () => Promise<void> | void;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = "¿Estás seguro de eliminar?",
  description = "Esta acción no se puede deshacer.",
  requireTextConfirm = false,
  confirmText = "ELIMINAR",
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [typed, setTyped] = React.useState("");

  const canConfirm =
    !requireTextConfirm || typed.trim().toUpperCase() === confirmText;

  const handleConfirm = () => {
    setError(null);

    startTransition(async () => {
      try {
        await onConfirm();
        onOpenChange(false);
        setTyped("");
      } catch (_) {
        setError("No se pudo eliminar. Intentá de nuevo.");
        console.log(_);
      }
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setError(null);
          setTyped("");
        }
        onOpenChange(v);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">{description}</span>

            {requireTextConfirm ? (
              <div className="space-y-2 pt-2">
                <label className="text-sm text-muted-foreground">
                  Para confirmar, escribí{" "}
                  <span className="font-medium text-foreground">
                    {confirmText}
                  </span>
                </label>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder={confirmText}
                  autoFocus
                />
              </div>
            ) : null}

            {error ? (
              <p className="text-sm text-destructive pt-2">{error}</p>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending || !canConfirm}
            >
              {isPending ? "Eliminando..." : "Sí"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
