"use server";

import { Exercise } from "@/feature/exercises/actions/getExercise";
import { Weekday } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";

async function getDays() {
  const exercise = await prisma.trainingDay.findMany({
    where: { userId: "cmkfi7wdo000074druqcsgf8x" },
    include: {
      blocks: {
        orderBy: { order: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: {
              exercise: true,
            },
          },
        },
      },
    },
  });
  return exercise as TrainingDayWithBlocks[];
}

export default getDays;
export type TrainingBlockExercise = {
  id: string;
  blockId: string;
  exerciseId: string;
  order: number;
  targetSets: number | null;
  targetReps: string | null;
  restSeconds: number | null;
  exercise: Exercise;
};

export type TrainingBlock = {
  id: string;
  trainingDayId: string;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  exercises: TrainingBlockExercise[];
};

export type TrainingDay = {
  id: string;
  userId: string;
  day: Weekday;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingDayWithBlocks = TrainingDay & {
  blocks: TrainingBlock[];
};

// 1) Definimos el payload exacto que devuelve esta query
