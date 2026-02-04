import prisma from "@/lib/prisma";
import { Prisma, Weekday } from "@/generated/prisma/client"; // si Weekday lo tenés en enums, importalo desde ahí

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
 * PLAN: Fuerza / Potencia
 * =========================
 */
const strengthRoutine: DayPlan[] = [
  {
    day: Weekday.lunes,
    name: "Lower Strength + Tendón (pesado controlado con micro-contraste)",
    blocks: [
      {
        title: "Calentamiento (15’)",
        order: 1,
        exercises: [
          { name: "Bici suave / caminata inclinada", sets: 1, reps: "3 min", restSeconds: 0 },
          { name: "Tobillo knee-to-wall", sets: 2, reps: "8/lado", restSeconds: 30 },
          { name: "90/90 cadera", sets: 1, reps: "6/lado", restSeconds: 30 },
          { name: "Puente glúteo (pausa 2s arriba)", sets: 2, reps: "8", restSeconds: 45 },
          { name: "Tibialis raises", sets: 2, reps: "12", restSeconds: 45 },
          { name: "Dead bug o bird-dog (control tronco)", sets: 2, reps: "6/lado", restSeconds: 45 },
        ],
      },
      {
        title: "Micro-contraste (PAPE) integrado al squat",
        order: 2,
        exercises: [
          {
            name: "Back Squat + 1 CMJ entre series",
            sets: 5,
            reps: "2 @RPE 7–8 + 1 salto",
            restSeconds: 150,
            description:
              "Descanso 2–3’. Entre series: 1 CMJ máximo. Post-salto 60–90s. " +
              "Si CMJ sale lento/pesado: bajar 2.5–5 kg o quitar salto.",
          },
        ],
      },
      {
        title: "Fuerza secundaria (25–30’)",
        order: 3,
        exercises: [
          { name: "RDL", sets: 4, reps: "5 @RPE 7–8", restSeconds: 120 },
          { name: "RFESS / Split squat", sets: 3, reps: "6/lado @RPE 7", restSeconds: 90 },
        ],
      },
      {
        title: "Accesorios (8–10’)",
        order: 4,
        exercises: [
          { name: "Soleus raise (rodilla flexionada)", sets: 3, reps: "10 @RPE 8", restSeconds: 60 },
          { name: "Nordic asistido", sets: 2, reps: "4 (solo calidad)", restSeconds: 90 },
        ],
      },
      {
        title: "Finisher tendón (10–12’)",
        order: 5,
        exercises: [
          { name: "Spanish Squat isométrico", sets: 5, reps: "45–60s", restSeconds: 60, description: "Dolor 0–3/10." },
          { name: "Isométrico Aquiles (calf raise hold)", sets: 4, reps: "30–45s/lado", restSeconds: 60 },
        ],
      },
      {
        title: "Salida (2–4’)",
        order: 6,
        exercises: [
          { name: "Respiración nasal + caminata suave", sets: 1, reps: "2–3 min", restSeconds: 0 },
          { name: "Auto-reporte (rodilla 0–10, Aquiles 0–10)", sets: 1, reps: "registrar", restSeconds: 0 },
        ],
      },
    ],
  },

  {
    day: Weekday.martes,
    name: "Microdosis Stiffness + Vóley (20–23)",
    blocks: [
      {
        title: "Microdosis Stiffness (10–15’)",
        order: 1,
        exercises: [
          {
            name: "Pogos muy bajos (tobillo dominante)",
            sets: 4,
            reps: "20–30 contactos",
            restSeconds: 60,
            description: "Rodilla casi fija, silencioso, rebote rápido. Rodilla sensible: solo pogos + sóleo.",
          },
          { name: "Hops unipodales suaves (lineales)", sets: 3, reps: "10–15 contactos/pierna", restSeconds: 60 },
          { name: "Isométrico sóleo (opcional)", sets: 2, reps: "30–45s/lado", restSeconds: 60 },
        ],
      },
      {
        title: "Vóley (20–23)",
        order: 2,
        exercises: [{ name: "Vóley - técnica y juego", sets: 1, reps: "20:00–23:00", restSeconds: 0 }],
      },
    ],
  },

  {
    day: Weekday.miercoles,
    name: "Neural corto centrado en Approach (calidad máxima)",
    blocks: [
      {
        title: "Entrada (6–8’)",
        order: 1,
        exercises: [
          { name: "Caminata / bici suave", sets: 1, reps: "2 min", restSeconds: 0 },
          { name: "Knee-to-wall", sets: 1, reps: "6/6", restSeconds: 30 },
          { name: "90/90", sets: 1, reps: "4/4", restSeconds: 30 },
          { name: "Pogos muy bajos (entrada)", sets: 1, reps: "10 contactos", restSeconds: 30 },
        ],
      },
      {
        title: "Approach Jumps (bloque principal)",
        order: 2,
        exercises: [
          {
            name: "Approach jump (máxima calidad)",
            sets: 10,
            reps: "1 intento (6–10 totales)",
            restSeconds: 120,
            description: "Descanso 90–150s. Corte si cae coordinación. Calidad máxima.",
          },
        ],
      },
      {
        title: "Stiffness breve (6–8’)",
        order: 3,
        exercises: [
          { name: "Pogos", sets: 3, reps: "20–25", restSeconds: 60 },
          { name: "Snap-down + stick", sets: 3, reps: "2", restSeconds: 60 },
        ],
      },
      {
        title: "Isométrico sóleo (2–4’)",
        order: 4,
        exercises: [{ name: "Isométrico sóleo", sets: 2, reps: "30–45s", restSeconds: 60 }],
      },
    ],
  },

  {
    day: Weekday.jueves,
    name: "Recuperación activa + Vóley (20–23)",
    blocks: [
      {
        title: "Recuperación activa (opcional)",
        order: 1,
        exercises: [
          { name: "Caminata suave", sets: 1, reps: "5 min", restSeconds: 0 },
          { name: "Movilidad tobillo/cadera (baja dosis)", sets: 1, reps: "10–12 min", restSeconds: 0 },
          { name: "Spanish squat ISO (si rodilla carga)", sets: 3, reps: "45s", restSeconds: 60 },
        ],
      },
      {
        title: "Vóley (20–23)",
        order: 2,
        exercises: [{ name: "Vóley - guardar output para viernes", sets: 1, reps: "20:00–23:00", restSeconds: 0 }],
      },
    ],
  },

  {
    day: Weekday.viernes,
    name: "Lower Power + Speed (sesión grande)",
    blocks: [
      {
        title: "Calentamiento (12–15’)",
        order: 1,
        exercises: [
          { name: "Pogos muy bajos", sets: 2, reps: "15–20", restSeconds: 45 },
          { name: "A-skip", sets: 2, reps: "15 m", restSeconds: 60 },
          { name: "Progresiones 10 m", sets: 2, reps: "10 m", restSeconds: 60 },
        ],
      },
      {
        title: "Transferencia (primero)",
        order: 2,
        exercises: [
          { name: "Approach 3 pasos + salto (70–85%)", sets: 4, reps: "1", restSeconds: 60 },
          { name: "Approach (90–95%)", sets: 5, reps: "1", restSeconds: 120 },
        ],
      },
      {
        title: "Velocidad",
        order: 3,
        exercises: [
          { name: "Sprint 10 m", sets: 6, reps: "10 m", restSeconds: 90 },
          { name: "Sprint 20 m", sets: 2, reps: "20 m", restSeconds: 120 },
        ],
      },
      {
        title: "Potencia balística",
        order: 4,
        exercises: [{ name: "Jump Squat (barra liviana)", sets: 6, reps: "3 @20–30% 1RM", restSeconds: 120 }],
      },
      {
        title: "Reactivo (rotativo)",
        order: 5,
        exercises: [
          { name: "Semana A: Depth/Drop jump 20–30 cm", sets: 5, reps: "2", restSeconds: 120 },
          { name: "Semana B: Hurdle hops bajos + pogos", sets: 1, reps: "Hurdle 4×4 + Pogos 2×20", restSeconds: 120 },
          { name: "Semana C: Snap-down + rebound", sets: 6, reps: "2", restSeconds: 90 },
          { name: "Semana D: Bounds", sets: 4, reps: "20 m", restSeconds: 120 },
        ],
      },
      {
        title: "Fuerza rápida",
        order: 6,
        exercises: [
          { name: "Hip Thrust", sets: 4, reps: "4 @RPE 7–8", restSeconds: 120 },
          { name: "Copenhagen", sets: 2, reps: "20–30s/lado", restSeconds: 60 },
        ],
      },
      {
        title: "Salida",
        order: 7,
        exercises: [
          { name: "Caminata + respiración nasal", sets: 1, reps: "3–5 min", restSeconds: 0 },
          { name: "Auto-reporte (rodilla/Aquiles/rebote)", sets: 1, reps: "registrar", restSeconds: 0 },
        ],
      },
    ],
  },

  {
    day: Weekday.sabado,
    name: "Microdosis Stiffness + Vóley (si toca)",
    blocks: [
      {
        title: "Microdosis",
        order: 1,
        exercises: [
          { name: "Pogos", sets: 4, reps: "20–25", restSeconds: 60 },
          { name: "Hops suaves", sets: 2, reps: "10–12 por pierna", restSeconds: 60 },
          { name: "Isométrico sóleo", sets: 2, reps: "30–45s", restSeconds: 60 },
        ],
      },
      { title: "Vóley (opcional)", order: 2, exercises: [{ name: "Vóley (si toca)", sets: 1, reps: "sesión", restSeconds: 0 }] },
    ],
  },

  {
    day: Weekday.domingo,
    name: "Descanso estratégico",
    blocks: [
      {
        title: "Recuperación",
        order: 1,
        exercises: [
          { name: "Caminata suave", sets: 1, reps: "20–40 min", restSeconds: 0 },
          { name: "Movilidad tobillo/cadera (leve)", sets: 1, reps: "8–12 min", restSeconds: 0 },
          { name: "Spanish squat ISO (si rodilla carga)", sets: 3, reps: "45s", restSeconds: 60 },
        ],
      },
    ],
  },
];

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
  if (missing.length) throw new Error(`Missing Exercise rows after ensureExercises: ${missing.join(" | ")}`);

  return map;
}

export async function seedStrengthPlan(userId: string): Promise<{ ok: true }> {
  const planName = "Fuerza/Potencia (Vertical Jump)";
  const allPlanExercises = strengthRoutine.flatMap((d) => d.blocks.flatMap((b) => b.exercises));

  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await acquireSeedLock(tx, `seed:${planName}:${userId}`);

      const plan = await tx.plan.upsert({
        where: { userId_name: { userId, name: planName } },
        update: { isActive: true },
        create: { userId, name: planName, isActive: true },
        select: { id: true },
      });

      const exMap = await ensureExercises(userId, allPlanExercises, tx);

      for (const dayPlan of strengthRoutine) {
        const planDay = await tx.planDay.upsert({
          where: { planId_day: { planId: plan.id, day: dayPlan.day } },
          update: { name: dayPlan.name },
          create: { planId: plan.id, day: dayPlan.day, name: dayPlan.name },
          select: { id: true },
        });

        await tx.planBlock.deleteMany({ where: { planDayId: planDay.id } });

        for (const block of dayPlan.blocks) {
          // crear bloque primero
          const createdBlock = await tx.planBlock.create({
            data: {
              planDayId: planDay.id,
              title: block.title,
              order: block.order,
            },
            select: { id: true },
          });

          // luego crear ejercicios del bloque (rápido)
          const toCreate: Prisma.PlanBlockExerciseCreateManyInput[] = block.exercises.map((ex, idx) => {
            const key = norm(ex.name);
            const exerciseId = exMap.get(key);
            if (!exerciseId) throw new Error(`Missing Exercise id for "${ex.name}" (norm="${key}")`);

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
    { timeout: 120000, maxWait: 5000 }
  );

  return { ok: true };
}
