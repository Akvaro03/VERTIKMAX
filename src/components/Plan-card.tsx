import { planType } from "@/feature/plan/type/plan.type";
import { Card } from "./ui/card";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import changeActivePlan from "@/feature/plan/actions/changeActivePlan";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import DialogTranscription from "./DialogTranscription";

type PlanCardProps = {
  plan: planType;
};
function PlanCard({ plan }: PlanCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openTranscription, setOpenTranscription] = useState(false);
  const daysCount = plan.days?.length ?? 0;
  const exercisesCount =
    plan.days?.reduce((accDay, d) => {
      const blocks = d.blocks ?? [];
      const dayCount = blocks.reduce(
        (accB, b) => accB + (b.exercises?.length ?? 0),
        0,
      );
      return accDay + dayCount;
    }, 0) ?? 0;
  const toggle = () => {
    // console.log(day)
    setOpen((prev) => {
      const next = !prev;
      // Si querés que "seleccionar" sea abrir, llamalo acá cuando abre
      return next;
    });
  };
  return (
    <Card
      key={plan.id}
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-lg leading-tight truncate">
                  {plan.name}
                </h3>

                <Badge
                  variant="secondary"
                  className={[
                    "border-0 text-xs font-medium",
                    plan.isActive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-secondary/50 text-muted-foreground",
                  ].join(" ")}
                >
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mt-0.5">
                {daysCount} {daysCount === 1 ? "día" : "días"} ·{" "}
                {exercisesCount}{" "}
                {exercisesCount === 1 ? "ejercicio" : "ejercicios"}
              </p>
            </div>
          </div>
          <div className={["", transition, open ? show : hide].join(" ")}>
            {plan.isActive ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDelete(true);
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
                onClick={(e) => {
                  e.stopPropagation();
                  changeActivePlan({ idPlan: plan.id, newState: true });
                  toast.success("Plan Activado"); // si usás sonner/toast
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
            <DialogTranscription
              isOpen={openTranscription}
              onOpenChange={setOpenTranscription}
              planData={plan}
            />
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

        {/* Opcional: mini preview de 1-2 días */}
        {plan.days?.length ? (
          <div className="mt-4 grid gap-2">
            {plan.days
              .slice()
              .sort((a, b) => (a.day as string).localeCompare(b.day as string))
              .slice(0, open ? 10 : 2)
              .map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {d.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-secondary/40 border-0 text-[11px] font-medium"
                    >
                      {String(d.day).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </div>
      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Desactivar este plan?"
        description="Desactivar este plan hará que no se muestre en el dashboard."
        requireTextConfirm={false} // ponelo true si es algo muy crítico
        onConfirm={async () => {
          await changeActivePlan({ idPlan: plan.id, newState: false });
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        }}
      />
    </Card>
  );
}

export default PlanCard;

const baseBtn = "bg-background/70 backdrop-blur border rounded-xl shadow-sm";
const transition = "transition-all duration-200 ease-out";

const show =
  "opacity-100 scale-100 pointer-events-auto translate-y-0 my-4 space-x-3";
const hide = "opacity-0 scale-95 pointer-events-none translate-y-1";

const iconCls = "w-4 h-4";
