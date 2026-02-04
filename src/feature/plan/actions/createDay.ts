"use server";

import prisma from "@/lib/prisma";
import { Prisma, Weekday } from "@/generated/prisma/client";

type CreatePlanDayWithBlocksParams = {
  userId: string;
  planId: string; // 👈 ahora necesitas el plan
  day: Weekday;
  name: string;
  blocks: Array<{
    title: string;
    order?: number;
    exercises: Array<{
      exerciseId: string;
      order?: number;
      targetSets?: number | null;
      targetReps?: string | null;
      restSeconds?: number | null;
    }>;
  }>;
};

export async function upsertPlanDayWithBlocks(params: CreatePlanDayWithBlocksParams) {
  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // 0) Validar que el plan pertenezca al user
      const plan = await tx.plan.findFirst({
        where: { id: params.planId, userId: params.userId },
        select: { id: true },
      });
      if (!plan) {
        throw new Error("Plan not found for this user.");
      }

      // 1) Upsert PlanDay
      const planDay = await tx.planDay.upsert({
        where: { planId_day: { planId: plan.id, day: params.day } },
        update: { name: params.name },
        create: { planId: plan.id, day: params.day, name: params.name },
        select: { id: true, day: true, name: true },
      });

      // 2) Idempotente: reemplazar el día completo
      await tx.planBlock.deleteMany({ where: { planDayId: planDay.id } });

      // 3) Crear blocks + ejercicios (sin nested)
      for (let i = 0; i < params.blocks.length; i++) {
        const block = params.blocks[i];
        const blockOrder = block.order ?? i;

        const createdBlock = await tx.planBlock.create({
          data: {
            planDayId: planDay.id,
            title: block.title,
            order: blockOrder,
          },
          select: { id: true },
        });

        if (block.exercises.length) {
          const rows: Prisma.PlanBlockExerciseCreateManyInput[] = block.exercises.map((e, j) => ({
            blockId: createdBlock.id,
            exerciseId: e.exerciseId,
            order: e.order ?? j,
            targetSets: e.targetSets ?? null,
            targetReps: e.targetReps ?? null,
            restSeconds: e.restSeconds ?? null,
          }));

          await tx.planBlockExercise.createMany({
            data: rows,
            skipDuplicates: true,
          });
        }
      }

      return planDay;
    },
    { timeout: 60000, maxWait: 5000 }
  );
}
