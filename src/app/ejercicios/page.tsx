"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { deleteExercise } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Pencil, Dumbbell } from "lucide-react";
import Link from "next/link";
import createExercise from "@/feature/exercises/actions/createExercise";
import getExercise from "@/feature/exercises/actions/getExercise";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const reloadExercises = async () => {
    const list = await getExercise();
    setExercises(list as Exercise[]);
  };

  useEffect(() => {
    let cancelled = false;

    getExercise()
      .then((list) => {
        console.log(list);
        if (!cancelled) setExercises(list as Exercise[]);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (editingExercise) {
    //   updateExercise(editingExercise.id, { name, category });
    // } else {
    //   addExercise({ name, category });
    // }
    try {
      await createExercise({ description: category, name });
      setName("");
      setCategory("");
      setEditingExercise(null);
      setDialogOpen(false);
      await reloadExercises();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setCategory(exercise.description || "");
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "¿Estás seguro de eliminar este ejercicio? Se perderán todos los registros asociados.",
      )
    ) {
      deleteExercise(id);
      // setExercises(getExercises());
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExercise(null);
    setName("");
    setCategory("");
  };

  const categories = [
    ...new Set(exercises?.map((e) => e.description || "Sin categoría")),
  ];
  console.log(categories);
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Gestionar Ejercicios
                </h1>
                <p className="text-xs text-muted-foreground">
                  Edita tu lista de ejercicios
                </p>
              </div>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              size="icon"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {exercises?.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Dumbbell className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                No hay ejercicios
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto text-balance">
                Crea tu primer ejercicio para comenzar
              </p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ejercicio
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              {exercises &&
                exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate">
                          {exercise.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {exercise.description || "Sin categoría"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(exercise)}
                        className="rounded-lg h-9 w-9"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(exercise.id)}
                        className="rounded-lg h-9 w-9 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "Editar Ejercicio" : "Nuevo Ejercicio"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del ejercicio</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Press de banca"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Pecho, Espalda, Piernas..."
                required
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {editingExercise ? "Guardar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
type Exercise = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
