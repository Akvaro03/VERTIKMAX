import prisma from "@/lib/prisma";
import { Prisma, Weekday } from "@/generated/prisma/client";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");

type PlanExercise = {
  name: string;
  description?: string;
  sets?: number | null;
  reps?: string | null;
  restSeconds?: number | null;
};

type DayBlock = {
  title: string;
  order: number;
  exercises: PlanExercise[];
};

type DayPlan = {
  day: Weekday;
  name: string;
  blocks: DayBlock[];
};

/**
 * =========================
 * DATA (tu rutina)
 * =========================
 * Pegá acá tu `mobilityRoutine` tal cual lo tenías.
 */
const baseDaily: DayBlock = {
  title: "A) Base diaria (10–12 min) — “rango usable”",
  order: 1,
  exercises: [
    { name: "CARs de cadera", sets: 1, reps: "2 reps lentas por lado", restSeconds: 15 },
    { name: "Tobillo knee-to-wall + hold", sets: 2, reps: "8/lado + hold 10s", restSeconds: 30 },
    { name: "90/90 switches controlados", sets: 2, reps: "6/lado", restSeconds: 30 },
    { name: "90/90 lift-off", sets: 1, reps: "5/lado", restSeconds: 30 },
    { name: "Torácica — Open book", sets: 2, reps: "5/lado (pausa 2s)", restSeconds: 30 },
    { name: "Escápula — Scap push-ups", sets: 2, reps: "10", restSeconds: 30 },
  ],
};

const primerLeg: DayBlock = {
  title: "B) Primer (8 min) para días de pierna (L–X–V)",
  order: 2,
  exercises: [
    { name: "Soleus iso (rodilla flexionada)", sets: 2, reps: "30–45s/lado", restSeconds: 30 },
    { name: "Aductor rockback", sets: 1, reps: "10/lado (pausa 1s atrás)", restSeconds: 15 },
    { name: "Cossack asistido", sets: 1, reps: "5/lado (pausa 2s abajo)", restSeconds: 30 },
    { name: "Wall slides (torácica + hombro)", sets: 1, reps: "8", restSeconds: 30 },
  ],
};

const postLeg: DayBlock = {
  title: "C) Post (10 min) para días de pierna (L–X–V)",
  order: 3,
  exercises: [
    { name: "Spanish squat isométrico", sets: 3, reps: "30–45s (dolor ≤ 3/10)", restSeconds: 60 },
    { name: "Couch stretch con activación", sets: 2, reps: "45s/lado (+10s glúteo)", restSeconds: 30 },
    { name: "Respiración 90/90 (piernas en silla)", sets: 1, reps: "5 respiraciones lentas", restSeconds: 0 },
  ],
};

const tuesdayA: DayBlock = {
  title: "Martes — Sesión A (Lower / postura baja / cambios de dirección)",
  order: 2,
  exercises: [
    { name: "Dorsiflexión cargada", sets: 3, reps: "45s/lado (+ micro-empujes 10s)", restSeconds: 45 },
    { name: "Elevación de sóleo excéntrica", sets: 3, reps: "10/lado (3s bajada)", restSeconds: 45 },
    { name: "Cossack squat", sets: 3, reps: "6/lado (pausa 2s abajo)", restSeconds: 60 },
    { name: "Copenhagen plank (palanca corta)", sets: 3, reps: "20–30s/lado", restSeconds: 45 },
    { name: "RDL isométrico en estiramiento", sets: 2, reps: "20–30s", restSeconds: 60 },
    { name: "Hip IR lift-offs (sentado 90/90)", sets: 2, reps: "6/lado", restSeconds: 30 },
  ],
};

const thursdayB: DayBlock = {
  title: "Jueves — Sesión B (Upper / torácica / hombro / latigazo)",
  order: 2,
  exercises: [
    { name: "Extensión torácica (foam roller)", sets: 2, reps: "6 respiraciones", restSeconds: 30 },
    { name: "Rotación torácica medio arrodillado (windmill/reach-through)", sets: 3, reps: "5/lado", restSeconds: 45 },
    { name: "90/90 external rotation con banda", sets: 3, reps: "12/lado", restSeconds: 45 },
    { name: "Wall slide + lift-off (overhead)", sets: 3, reps: "8", restSeconds: 45 },
    { name: "Dead hang / active hang", sets: 5, reps: "15–25s", restSeconds: 45 },
    { name: "Antebrazo — pron/sup + extensión excéntrica", sets: 2, reps: "15 + 12", restSeconds: 45 },
  ],
};

const saturdayTransfer: DayBlock = {
  title: "Sábado — Transfer (20 min) “rangos que se vuelven vóley”",
  order: 2,
  exercises: [
    { name: "Split-step → caída a postura baja", sets: 6, reps: "2 reps", restSeconds: 30 },
    { name: "Shuffle lateral → lunge lateral controlado", sets: 4, reps: "por lado (pausa 2s)", restSeconds: 45 },
    { name: "Carrera de remate 70–80%", sets: 10, reps: "6–10 reps", restSeconds: 45 },
    { name: "Armado de brazo en seco", sets: 2, reps: "8", restSeconds: 45 },
  ],
};

const mobilityRoutine: DayPlan[] = [
  { day: Weekday.lunes, name: "Base diaria + Primer/Post (pierna)", blocks: [baseDaily, primerLeg, postLeg] },
  { day: Weekday.martes, name: "Base diaria + Sesión A (Lower/COD)", blocks: [baseDaily, tuesdayA] },
  { day: Weekday.miercoles, name: "Base diaria + Primer/Post (pierna)", blocks: [baseDaily, primerLeg, postLeg] },
  { day: Weekday.jueves, name: "Base diaria + Sesión B (Upper)", blocks: [baseDaily, thursdayB] },
  { day: Weekday.viernes, name: "Base diaria + Primer/Post (pierna)", blocks: [baseDaily, primerLeg, postLeg] },
  { day: Weekday.sabado, name: "Base diaria + Transfer", blocks: [baseDaily, saturdayTransfer] },
  { day: Weekday.domingo, name: "Solo base diaria", blocks: [baseDaily] },
];

/**
 * =========================
 * LOCK (Postgres)
 * =========================
 * Bloquea concurrent seeds con la misma key, dentro de la transacción.
 */
async function acquireSeedLock(tx: Prisma.TransactionClient, key: string): Promise<void> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}), 0)`;
}

async function ensureExercises(
  userId: string,
  exs: PlanExercise[],
  tx: Prisma.TransactionClient
): Promise<Map<string, string>> {
  const byName = new Map<string, PlanExercise>();
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

export async function seedMobilityPlan(userId: string): Promise<{ ok: true }> {
  const planName = "Movilidad/Prehab (Diario)";
  const allPlanExercises = mobilityRoutine.flatMap((d) => d.blocks.flatMap((b) => b.exercises));

  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await acquireSeedLock(tx, `seed:${planName}:${userId}`);

      const plan = await tx.plan.upsert({
        where: { userId_name: { userId, name: planName } },
        update: {},
        create: { userId, name: planName, isActive: false },
        select: { id: true },
      });

      const exMap = await ensureExercises(userId, allPlanExercises, tx);

      for (const dayPlan of mobilityRoutine) {
        const planDay = await tx.planDay.upsert({
          where: { planId_day: { planId: plan.id, day: dayPlan.day } },
          update: { name: dayPlan.name },
          create: { planId: plan.id, day: dayPlan.day, name: dayPlan.name },
          select: { id: true },
        });

        // idempotente POR plan-day
        await tx.planBlock.deleteMany({ where: { planDayId: planDay.id } });

        for (const block of dayPlan.blocks) {
          // 1) Crear bloque (sin nested)
          const createdBlock = await tx.planBlock.create({
            data: {
              planDayId: planDay.id,
              title: block.title,
              order: block.order,
            },
            select: { id: true },
          });

          // 2) Crear ejercicios del bloque con createMany
          const toCreate: Prisma.PlanBlockExerciseCreateManyInput[] = block.exercises.map((ex, idx) => {
            const key = norm(ex.name);
            const exerciseId = exMap.get(key);
            if (!exerciseId) {
              throw new Error(`Missing Exercise id for "${ex.name}" (norm="${key}")`);
            }

            return {
              blockId: createdBlock.id,
              exerciseId,
              order: idx + 1,
              targetSets: ex.sets ?? null,
              targetReps: ex.reps ?? null,
              restSeconds: ex.restSeconds ?? null,
            };
          });

          await tx.planBlockExercise.createMany({
            data: toCreate,
            skipDuplicates: true,
          });
        }
      }
    },
    { timeout: 60000, maxWait: 5000 }
  );

  return { ok: true };
}
