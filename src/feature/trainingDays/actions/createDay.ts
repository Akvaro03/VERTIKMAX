"use server";

import { Weekday } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";

export async function createTrainingDayWithBlocks(params: {
  userId: string;
  day: Weekday;
  name: string;
  blocks: Array<{
    title: string;
    order?: number; // orden del bloque
    exercises: Array<{
      exerciseId: string;
      order?: number; // orden dentro del bloque
      targetSets?: number | null;
      targetReps?: string | null;
      restSeconds?: number | null;
    }>;
  }>;
}) {
  return prisma.$transaction(async (tx) => {
    // 1) Crear el día
    const trainingDay = await tx.trainingDay.create({
      data: {
        userId: params.userId,
        day: params.day,
        name: params.name,
      },
      select: { id: true, day: true, name: true },
    });

    // 2) Crear bloques + ejercicios por bloque
    // Usamos create con nested createMany para no tener que hacer 2 loops con mapping de IDs
    for (let i = 0; i < params.blocks.length; i++) {
      const block = params.blocks[i];
      const blockOrder = block.order ?? i;

      await tx.trainingBlock.create({
        data: {
          trainingDayId: trainingDay.id,
          title: block.title,
          order: blockOrder,
          exercises: block.exercises.length
            ? {
                createMany: {
                  data: block.exercises.map((e, j) => ({
                    exerciseId: e.exerciseId,
                    order: e.order ?? j,
                    targetSets: e.targetSets ?? null,
                    targetReps: e.targetReps ?? null,
                    restSeconds: e.restSeconds ?? null,
                  })),
                },
              }
            : undefined,
        },
        select: { id: true },
      });
    }

    return trainingDay;
  });
}
