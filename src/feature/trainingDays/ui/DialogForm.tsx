import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { TrainingDayWithBlocks } from "../actions/getDays";
import { Exercise } from "@/feature/exercises/actions/getExercise";
import { Button } from "@/components/ui/button";
import { Weekday } from "@/generated/prisma/browser";
import { Plus, Trash2 } from "lucide-react";
import { createTrainingDayWithBlocks } from "../actions/createDay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import register from "@/feature/auth/actions/register";

function DialogForm(isOpen: boolean, onOpenChange: (open: boolean) => void) {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<TrainingDayWithBlocks | null>(
    null
  );
  const [formData, setFormData] = useState<{
    name: string;
    day: Weekday;
    exerciseBlocks: string[][];
    blockTitles: string[];
  }>({
    name: "",
    day: "lunes" as Weekday,
    exerciseBlocks: [[]], // bloque 1 por defecto
    blockTitles: ["Bloque 1"], // titulo por defecto
  });

  const totalSelected = useMemo(
    () => formData.exerciseBlocks.reduce((acc, block) => acc + block.length, 0),
    [formData.exerciseBlocks]
  );

  const handleOpenDialog = (day?: TrainingDayWithBlocks) => {
    if (day) {
      setEditingDay(day);

      // Por ahora: si el día viene plano, lo ponemos en 1 solo bloque
      setFormData({
        name: day.name,
        day: day.day,
        exerciseBlocks: [
          day.blocks.flatMap((b) => b.exercises.map((e) => e.id)),
        ],
        blockTitles: ["Bloque 1"], // si luego persistís títulos, acá los cargás
      });
    } else {
      setEditingDay(null);
      setFormData({
        name: "",
        day: "lunes" as Weekday,
        exerciseBlocks: [[]],
        blockTitles: ["Bloque 1"],
      });
    }
    setDialogOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || totalSelected === 0) return;

    const dayValue = formData.day as Weekday;

    // Aplanamos todos los bloques para el backend actual
    const flattened = formData.exerciseBlocks.flat();

    setDialogOpen(false);
    setFormData({
      name: "",
      day: "lunes" as Weekday,
      exerciseBlocks: [[]],
      blockTitles: ["Bloque 1"],
    });

    await createTrainingDayWithBlocks({
      day: dayValue,
      name: formData.name,
      userId: "cmkfi7wdo000074druqcsgf8x",
      blocks: formData.exerciseBlocks.map((block, i) => ({
        title: formData.blockTitles[i],
        exercises: block.map((id) => ({ exerciseId: id })),
      })),
    });
  };
  const addExerciseBlock = () => {
    setFormData((prev) => {
      const nextIndex = prev.exerciseBlocks.length + 1;
      return {
        ...prev,
        exerciseBlocks: [...prev.exerciseBlocks, []],
        blockTitles: [...prev.blockTitles, `Bloque ${nextIndex}`],
      };
    });
  };
  const updateBlockTitle = (blockIndex: number, title: string) => {
    setFormData((prev) => {
      const nextTitles = [...prev.blockTitles];
      nextTitles[blockIndex] = title;
      return { ...prev, blockTitles: nextTitles };
    });
  };
  const removeExerciseBlock = (blockIndex: number) => {
    setFormData((prev) => {
      if (prev.exerciseBlocks.length === 1) return prev;

      return {
        ...prev,
        exerciseBlocks: prev.exerciseBlocks.filter((_, i) => i !== blockIndex),
        blockTitles: prev.blockTitles.filter((_, i) => i !== blockIndex),
      };
    });
  };
  const toggleExercise = (blockIndex: number, exerciseId: string) => {
    setFormData((prev) => {
      const next = [...prev.exerciseBlocks.map((b) => [...b])];
      const block = next[blockIndex] ?? [];

      next[blockIndex] = block.includes(exerciseId)
        ? block.filter((id) => id !== exerciseId)
        : [...block, exerciseId];

      return { ...prev, exerciseBlocks: next };
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Día
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editingDay ? "Editar Día" : "Nuevo Día de Entrenamiento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nombre del día
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Día de Pierna, Push Day..."
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day" className="text-foreground">
              Día
            </Label>

            <Select
              value={formData.day}
              onValueChange={(value) =>
                setFormData({ ...formData, day: value as Weekday })
              }
            >
              <SelectTrigger
                id="day"
                className="bg-background border-border text-foreground"
              >
                <SelectValue placeholder="Seleccioná un día" />
              </SelectTrigger>

              <SelectContent>
                {WEEKDAYS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">
                Ejercicios seleccionados ({totalSelected})
              </Label>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={addExerciseBlock}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar bloque
              </Button>
            </div>

            <div className="space-y-3">
              {formData.exerciseBlocks.map((block, blockIndex) => (
                <div
                  key={blockIndex}
                  className="rounded-2xl border border-border bg-background p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={
                          formData.blockTitles[blockIndex] ??
                          `Bloque ${blockIndex + 1}`
                        }
                        onChange={(e) =>
                          updateBlockTitle(blockIndex, e.target.value)
                        }
                        placeholder={`Bloque ${blockIndex + 1}`}
                        className="h-8 px-2 py-1 text-sm font-medium bg-transparent border-border/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({block.length})
                      </span>
                    </div>

                    {formData.exerciseBlocks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => removeExerciseBlock(blockIndex)}
                        aria-label="Eliminar bloque"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>

                  {isLoadingExercises ? (
                    <ExerciseBlockSkeleton />
                  ) : exercises.length === 0 ? (
                    <div className="rounded-xl border border-border p-4 bg-card">
                      <p className="text-sm text-muted-foreground text-center">
                        No hay ejercicios disponibles. Crea ejercicios primero.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl border border-border p-3 bg-card">
                      {exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`${blockIndex}-${exercise.id}`}
                            checked={block.includes(exercise.id)}
                            onCheckedChange={() =>
                              toggleExercise(blockIndex, exercise.id)
                            }
                          />
                          <label
                            htmlFor={`${blockIndex}-${exercise.id}`}
                            className="flex-1 text-sm text-foreground cursor-pointer"
                          >
                            {exercise.name}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({exercise.description || "Sin descripción"})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addExerciseBlock}
                className="w-full rounded-2xl border border-dashed border-border bg-card/40 hover:bg-card transition-colors p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-border bg-background flex items-center justify-center">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Agregar otro bloque de ejercicios
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Útil para circuitos, superseries o separar la sesión por
                      secciones.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!formData.name.trim() || totalSelected === 0}
          >
            {editingDay ? "Guardar Cambios" : "Crear Día"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={async () => {
              const user = await register();
              console.log(user);
            }}
          >
            Activar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;

// Si tu enum Weekday usa tildes, ajustá estos values a lo que realmente sea el enum.
const WEEKDAYS: Array<{ value: Weekday; label: string }> = [
  { value: "lunes" as Weekday, label: "Lunes" },
  { value: "martes" as Weekday, label: "Martes" },
  { value: "miercoles" as Weekday, label: "Miércoles" },
  { value: "jueves" as Weekday, label: "Jueves" },
  { value: "viernes" as Weekday, label: "Viernes" },
  { value: "sabado" as Weekday, label: "Sábado" },
  { value: "domingo" as Weekday, label: "Domingo" },
];
function ExerciseBlockSkeleton() {
  return (
    <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl border border-border p-3 bg-background">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}
