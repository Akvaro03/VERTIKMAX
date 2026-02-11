"use server"

// src/feature/seed/seedKneePlan.ts
import prisma from "@/lib/prisma";
import { Prisma, Weekday } from "@/generated/prisma/client";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");

type PlanExerciseInput = {
  name: string;
  description?: string;
  sets?: number | null;
  reps?: string | null;
  restSeconds?: number | null;
};

type BlockInput = {
  title: string;
  order: number;
  exercises: PlanExerciseInput[];
};

type DayInput = {
  day: Weekday;
  name: string;
  blocks: BlockInput[];
};

async function ensureExercises(
  userId: string,
  exs: PlanExerciseInput[],
  tx: Prisma.TransactionClient,
): Promise<Map<string, string>> {
  const byName = new Map<string, PlanExerciseInput>();
  for (const ex of exs) {
    const key = norm(ex.name);
    if (!byName.has(key)) byName.set(key, { ...ex, name: key });
  }
  const unique = Array.from(byName.values());

  await tx.exercise.createMany({
    data: unique.map((ex) => ({
      userId,
      name: ex.name,
      description: ex.description ?? null,
    })),
    skipDuplicates: true,
  });

  const rows = await tx.exercise.findMany({
    where: { userId, name: { in: unique.map((u) => u.name) } },
    select: { id: true, name: true },
  });

  const map = new Map(rows.map((r) => [norm(r.name), r.id]));
  const missing = unique.filter((u) => !map.has(norm(u.name))).map((u) => u.name);
  if (missing.length) {
    throw new Error(`Missing Exercise rows after ensureExercises: ${missing.join(" | ")}`);
  }

  return map;
}

/**
 * Crea/actualiza un plan con 2 días (Lunes y Miércoles) y sus bloques/ejercicios.
 * Idempotente: reemplaza los bloques del día completo.
 */
export async function upsertKneePlan(
  userId: string,
): Promise<{ ok: true; planId: string }> {
  const planName = "Rodilla (Fuerza + Tendón)";

  const routine: DayInput[] = [
    {
      day: Weekday.lunes,
      name: "Día lunes (fuerza controlada)",
      blocks: [
        {
          title: "Fuerza controlada",
          order: 1,
          exercises: [
            {
              name: "Step-up (altura media)",
              sets: 4,
              reps: "6–10 por pierna (bajada 2–3s)",
              description: "Altura media (NO altísimo). Controlá la bajada 2–3s.",
              restSeconds: null,
            },
            {
              name: "Split squat (zancada fija)",
              sets: 4,
              reps: "6–10 por pierna",
              restSeconds: null,
            },
            {
              name: "Extensión de rodilla (máquina) o Leg press (rango cómodo)",
              sets: 3,
              reps: "8–12",
              restSeconds: null,
            },
            {
              name: "Sóleo",
              sets: 3,
              reps: "12–20",
              restSeconds: null,
            },
          ],
        },
      ],
    },
    {
      day: Weekday.miercoles,
      name: "Día miércoles (tendón + control)",
      blocks: [
        {
          title: "Tendón + control",
          order: 1,
          exercises: [
            {
              name: "Sentadilla con talones elevados (rango medio)",
              sets: 4,
              reps: "8–12 (tempo 3s bajada)",
              description: "Talones elevados (placa/libro). Tempo 3s bajada.",
              restSeconds: null,
            },
            {
              name: "Step-down (control de rodilla)",
              sets: 3,
              reps: "8–12 por pierna",
              description: "Bajar de un escalón controlando la rodilla.",
              restSeconds: null,
            },
            {
              name: "RDL unilateral",
              sets: 3,
              reps: "6–10",
              description: "Bisagra para glúteo/isquio.",
              restSeconds: null,
            },
            {
              name: "Sóleo",
              sets: 3,
              reps: "12–20",
              restSeconds: null,
            },
          ],
        },
      ],
    },
  ];

  const allPlanExercises = routine.flatMap((d) => d.blocks.flatMap((b) => b.exercises));

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // 1) Upsert plan
      const plan = await tx.plan.upsert({
        where: { userId_name: { userId, name: planName } },
        update: {},
        create: { userId, name: planName, isActive: false },
        select: { id: true },
      });

      // 2) Ensure exercises
      const exMap = await ensureExercises(userId, allPlanExercises, tx);

      // 3) Upsert days, replace blocks, recreate blocks+exercises
      for (const dayPlan of routine) {
        const planDay = await tx.planDay.upsert({
          where: { planId_day: { planId: plan.id, day: dayPlan.day } },
          update: { name: dayPlan.name },
          create: { planId: plan.id, day: dayPlan.day, name: dayPlan.name },
          select: { id: true },
        });

        await tx.planBlock.deleteMany({ where: { planDayId: planDay.id } });

        for (const block of dayPlan.blocks) {
          await tx.planBlock.create({
            data: {
              planDayId: planDay.id,
              title: block.title,
              order: block.order,
              exercises: {
                create: block.exercises.map((ex, idx) => {
                  const key = norm(ex.name);
                  const exerciseId = exMap.get(key);
                  if (!exerciseId) throw new Error(`Missing Exercise id for "${ex.name}" (norm="${key}")`);

                  return {
                    order: idx + 1,
                    targetSets: ex.sets ?? null,
                    targetReps: ex.reps ?? null,
                    restSeconds: ex.restSeconds ?? null,
                    exercise: { connect: { id: exerciseId } },
                  };
                }),
              },
            },
            select: { id: true },
          });
        }
      }

      return plan.id;
    },
    { timeout: 60000, maxWait: 5000 },
  );

  return { ok: true, planId: result };
}
