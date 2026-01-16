"use client"

import type React from "react"

import { useState } from "react"
import { type Exercise, addWorkoutLog } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface LogWorkoutDialogProps {
  exercise: Exercise | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function LogWorkoutDialog({ exercise, open, onOpenChange, onSuccess }: LogWorkoutDialogProps) {
  const [weight, setWeight] = useState("")
  const [reps, setReps] = useState("")
  const [feeling, setFeeling] = useState<"easy" | "moderate" | "hard" | "very-hard">("moderate")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!exercise) return

    addWorkoutLog({
      exerciseId: exercise.id,
      weight: Number.parseFloat(weight),
      reps: Number.parseInt(reps),
      feeling,
      notes,
    })

    // Reset form
    setWeight("")
    setReps("")
    setFeeling("moderate")
    setNotes("")
    onSuccess()
    onOpenChange(false)
  }

  const feelings = [
    { value: "easy", label: "Fácil", emoji: "😊", color: "bg-green-500/10 border-green-500 text-green-500" },
    { value: "moderate", label: "Moderado", emoji: "💪", color: "bg-yellow-500/10 border-yellow-500 text-yellow-500" },
    { value: "hard", label: "Difícil", emoji: "😤", color: "bg-orange-500/10 border-orange-500 text-orange-500" },
    { value: "very-hard", label: "Muy Difícil", emoji: "🔥", color: "bg-red-500/10 border-red-500 text-red-500" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Registrar Entrenamiento</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{exercise?.name}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="60"
                required
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Repeticiones</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10"
                required
                className="text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sensación</Label>
            <div className="grid grid-cols-2 gap-2">
              {feelings.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFeeling(f.value as typeof feeling)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    feeling === f.value
                      ? f.color
                      : "bg-secondary/50 border-transparent text-muted-foreground hover:border-border"
                  }`}
                >
                  <div className="text-2xl mb-1">{f.emoji}</div>
                  <div className="text-xs font-medium">{f.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cómo te sentiste, ajustes técnicos..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Guardar Registro
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
