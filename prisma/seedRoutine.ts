export const Weekday = {
  lunes: 'lunes',
  martes: 'martes',
  miercoles: 'miercoles',
  jueves: 'jueves',
  viernes: 'viernes',
  sabado: 'sabado',
  domingo: 'domingo'
} as const

export type Weekday = (typeof Weekday)[keyof typeof Weekday]

import prisma from "../src/lib/prisma";

/* prisma/seedRoutine.ts */
type PlanExercise = {
  name: string;
  description?: string;
  sets?: number | null;
  reps?: string | null;
  restSeconds?: number | null;
};

type PlanBlock = {
  title: string;
  order: number;
  exercises: PlanExercise[];
};

type PlanDay = {
  day: Weekday;
  name: string;
  blocks: PlanBlock[];
};

const routine: PlanDay[] = [
  {
    day: Weekday.lunes,
    name: "Lower Strength + Tendón (pesado controlado con micro-contraste)",
    blocks: [
      {
        title: "Calentamiento (15’)",
        order: 1,
        exercises: [
          {
            name: "Bici suave / caminata inclinada",
            sets: 1,
            reps: "3 min",
            restSeconds: 0,
          },
          {
            name: "Tobillo knee-to-wall",
            sets: 2,
            reps: "8/lado",
            restSeconds: 30,
          },
          { name: "90/90 cadera", sets: 1, reps: "6/lado", restSeconds: 30 },
          {
            name: "Puente glúteo (pausa 2s arriba)",
            sets: 2,
            reps: "8",
            restSeconds: 45,
          },
          { name: "Tibialis raises", sets: 2, reps: "12", restSeconds: 45 },
          {
            name: "Dead bug o bird-dog (control tronco)",
            sets: 2,
            reps: "6/lado",
            restSeconds: 45,
          },
        ],
      },
      {
        title:
          "Micro-contraste (PAPE) integrado al squat (10–15’ dentro del bloque principal)",
        order: 2,
        exercises: [
          {
            name: "Back Squat + 1 CMJ entre series",
            sets: 5,
            reps: "2 @RPE 7–8 + 1 salto",
            restSeconds: 150,
            description:
              "Descanso 2–3’. Entre series: 1 CMJ máximo (1 rep). Descanso post-salto: 60–90s antes de la próxima serie. " +
              "Criterio: si el CMJ sale lento/pesado, bajar 2.5–5 kg o quitar el salto y terminar el trabajo pesado.",
          },
        ],
      },
      {
        title: "Fuerza secundaria (25–30’)",
        order: 3,
        exercises: [
          { name: "RDL", sets: 4, reps: "5 @RPE 7–8", restSeconds: 120 },
          {
            name: "RFESS / Split squat",
            sets: 3,
            reps: "6/lado @RPE 7",
            restSeconds: 90,
          },
        ],
      },
      {
        title: "Accesorios (8–10’)",
        order: 4,
        exercises: [
          {
            name: "Soleus raise (rodilla flexionada)",
            sets: 3,
            reps: "10 @RPE 8",
            restSeconds: 60,
          },
          {
            name: "Nordic asistido",
            sets: 2,
            reps: "4 (solo calidad, sin grind)",
            restSeconds: 90,
          },
        ],
      },
      {
        title: "Finisher tendón (10–12’)",
        order: 5,
        exercises: [
          {
            name: "Spanish Squat isométrico",
            sets: 5,
            reps: "45–60s",
            restSeconds: 60,
            description: "Dolor objetivo 0–3/10. Descanso 45–60s.",
          },
          {
            name: "Isométrico Aquiles (calf raise hold)",
            sets: 4,
            reps: "30–45s/lado",
            restSeconds: 60,
          },
        ],
      },
      {
        title: "Salida (2–4’)",
        order: 6,
        exercises: [
          {
            name: "Respiración nasal + caminata suave",
            sets: 1,
            reps: "2–3 min",
            restSeconds: 0,
          },
          {
            name: "Auto-reporte (rodilla 0–10, Aquiles 0–10)",
            sets: 1,
            reps: "registrar",
            restSeconds: 0,
          },
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
            description:
              "Claves: rodilla casi fija, silencioso, rebote rápido. Si rodilla sensible: hacer solo pogos + sóleo y omitir hops.",
          },
          {
            name: "Hops unipodales suaves (lineales)",
            sets: 3,
            reps: "10–15 contactos por pierna",
            restSeconds: 60,
          },
          {
            name: "Isométrico sóleo (opcional)",
            sets: 2,
            reps: "30–45s/lado",
            restSeconds: 60,
          },
        ],
      },
      {
        title: "Vóley (20–23)",
        order: 2,
        exercises: [
          {
            name: "Vóley - técnica y juego",
            sets: 1,
            reps: "20:00–23:00",
            restSeconds: 0,
            description:
              "En saltos: caer suave y evitar caer rígido si estás cansado.",
          },
        ],
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
          {
            name: "Caminata / bici suave",
            sets: 1,
            reps: "2 min",
            restSeconds: 0,
          },
          { name: "Knee-to-wall", sets: 1, reps: "6/6", restSeconds: 30 },
          { name: "90/90", sets: 1, reps: "4/4", restSeconds: 30 },
          {
            name: "Pogos muy bajos (entrada)",
            sets: 1,
            reps: "10 contactos",
            restSeconds: 30,
          },
        ],
      },
      {
        title: "Approach Jumps (bloque principal)",
        order: 2,
        exercises: [
          {
            name: "Approach jump (máxima calidad)",
            sets: 10,
            reps: "1 intento",
            restSeconds: 120,
            description:
              "6–10 intentos totales. Descanso 90–150s entre intentos. Criterios: penúltimo paso captura horizontal, último corto sólido, tronco firme, braceo agresivo sincronizado. " +
              "Corte: si coordinación cae, terminar (mejor 6 perfectos que 12 mediocres).",
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
        exercises: [
          {
            name: "Isométrico sóleo",
            sets: 2,
            reps: "30–45s",
            restSeconds: 60,
          },
        ],
      },
    ],
  },

  {
    day: Weekday.jueves,
    name: "Recuperación activa + Vóley (20–23)",
    blocks: [
      {
        title: "Recuperación activa (10–12’ opcional)",
        order: 1,
        exercises: [
          { name: "Caminata suave", sets: 1, reps: "5 min", restSeconds: 0 },
          {
            name: "Movilidad tobillo/cadera (baja dosis)",
            sets: 1,
            reps: "10–12 min",
            restSeconds: 0,
          },
          {
            name: "Spanish squat ISO (analgésico, si rodilla carga)",
            sets: 3,
            reps: "45s",
            restSeconds: 60,
            description: "Hacer por la tarde si molesta en el día a día.",
          },
        ],
      },
      {
        title: "Vóley (20–23)",
        order: 2,
        exercises: [
          {
            name: "Vóley - mantener output para viernes",
            sets: 1,
            reps: "20:00–23:00",
            restSeconds: 0,
            description: "Evitá extra saltos post-entreno.",
          },
        ],
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
        title: "Bloque de transferencia (primero)",
        order: 2,
        exercises: [
          {
            name: "Approach 3 pasos + salto (70–85%)",
            sets: 4,
            reps: "1",
            restSeconds: 60,
          },
          { name: "Approach (90–95%)", sets: 5, reps: "1", restSeconds: 120 },
        ],
      },
      {
        title: "Bloque velocidad (12–15’)",
        order: 3,
        exercises: [
          { name: "Sprint 10 m", sets: 6, reps: "10 m", restSeconds: 90 },
          { name: "Sprint 20 m", sets: 2, reps: "20 m", restSeconds: 120 },
        ],
      },
      {
        title: "Potencia balística (20–25’)",
        order: 4,
        exercises: [
          {
            name: "Jump Squat (barra liviana)",
            sets: 6,
            reps: "3 @20–30% 1RM squat",
            restSeconds: 120,
            description:
              "Corte: si caída >10% en output → terminar. Opción pro: cluster 6×(2+1) con 15–20s dentro.",
          },
        ],
      },
      {
        title: "Bloque reactivo (rotativo por semanas)",
        order: 5,
        exercises: [
          {
            name: "Semana A: Depth/Drop jump 20–30 cm",
            sets: 5,
            reps: "2",
            restSeconds: 120,
          },
          {
            name: "Semana B: Hurdle hops bajos + pogos",
            sets: 1,
            reps: "Hurdle 4×4 + Pogos 2×20",
            restSeconds: 120,
          },
          {
            name: "Semana C: Snap-down + rebound",
            sets: 6,
            reps: "2",
            restSeconds: 90,
          },
          {
            name: "Semana D: Bounds",
            sets: 4,
            reps: "20 m",
            restSeconds: 120,
            description:
              "Solo si tolerancia ok. Regla: si contacto se alarga o rodilla cargada → cambiar a snap-down + stick.",
          },
        ],
      },
      {
        title: "Fuerza rápida (8–12’)",
        order: 6,
        exercises: [
          { name: "Hip Thrust", sets: 4, reps: "4 @RPE 7–8", restSeconds: 120 },
          { name: "Copenhagen", sets: 2, reps: "20–30s/lado", restSeconds: 60 },
        ],
      },
      {
        title: "Salida (3–5’)",
        order: 7,
        exercises: [
          {
            name: "Caminata + respiración nasal",
            sets: 1,
            reps: "3–5 min",
            restSeconds: 0,
          },
          {
            name: "Auto-reporte (rodilla 0–10, Aquiles 0–10, rebote)",
            sets: 1,
            reps: "registrar",
            restSeconds: 0,
          },
        ],
      },
    ],
  },

  {
    day: Weekday.sabado,
    name: "Microdosis Stiffness + Vóley (si toca)",
    blocks: [
      {
        title: "Microdosis (10–12’)",
        order: 1,
        exercises: [
          { name: "Pogos", sets: 4, reps: "20–25", restSeconds: 60 },
          {
            name: "Hops suaves",
            sets: 2,
            reps: "10–12 por pierna (si tolera)",
            restSeconds: 60,
          },
          {
            name: "Isométrico sóleo",
            sets: 2,
            reps: "30–45s",
            restSeconds: 60,
          },
        ],
      },
      {
        title: "Vóley (opcional)",
        order: 2,
        exercises: [
          { name: "Vóley (si toca)", sets: 1, reps: "sesión", restSeconds: 0 },
        ],
      },
    ],
  },

  {
    day: Weekday.domingo,
    name: "Descanso estratégico (o recuperación activa suave)",
    blocks: [
      {
        title: "Recuperación / descanso",
        order: 1,
        exercises: [
          {
            name: "Caminata suave",
            sets: 1,
            reps: "20–40 min",
            restSeconds: 0,
          },
          {
            name: "Movilidad tobillo/cadera (leve)",
            sets: 1,
            reps: "8–12 min",
            restSeconds: 0,
          },
          {
            name: "Spanish squat ISO (si rodilla cargada)",
            sets: 3,
            reps: "45s",
            restSeconds: 60,
          },
        ],
      },
    ],
  },
];

async function ensureExercises(userId: string, exs: PlanExercise[]) {
  const uniqueNames = Array.from(new Set(exs.map((e) => e.name.trim())));

  const existing = await prisma.exercise.findMany({
    where: { userId, name: { in: uniqueNames } },
    select: { id: true, name: true },
  });

  const existingMap = new Map(existing.map((e) => [e.name, e.id]));

  // Crear faltantes
  for (const ex of exs) {
    if (!existingMap.has(ex.name)) {
      const created = await prisma.exercise.create({
        data: {
          userId,
          name: ex.name,
          description: ex.description ?? null,
        },
        select: { id: true, name: true },
      });
      existingMap.set(created.name, created.id);
    } else if (ex.description) {
      // si existe y trae description, opcional: actualizar solo si está vacío
      const id = existingMap.get(ex.name)!;
      await prisma.exercise
        .update({
          where: { id },
          data: {
            // guardamos description si estaba null
            description: ex.description,
          },
        })
        .catch(() => {
          // si no querés pisar descripciones ya editadas manualmente, podés quitar este update.
        });
    }
  }

  return existingMap;
}

async function seedRoutineForUser(userId: string) {
  // juntar todos los ejercicios del plan
  const allPlanExercises: PlanExercise[] = routine.flatMap((d) =>
    d.blocks.flatMap((b) => b.exercises),
  );

  const exerciseIdByName = await ensureExercises(userId, allPlanExercises);

  for (const dayPlan of routine) {
    await prisma.$transaction(async (tx) => {
      const trainingDay = await tx.trainingDay.upsert({
        where: { userId_day: { userId, day: dayPlan.day } },
        update: { name: dayPlan.name },
        create: { userId, day: dayPlan.day, name: dayPlan.name },
        select: { id: true },
      });

      // idempotencia: borramos bloques anteriores y recreamos
      await tx.trainingBlock.deleteMany({
        where: { trainingDayId: trainingDay.id },
      });

      for (const block of dayPlan.blocks) {
        await tx.trainingBlock.create({
          data: {
            trainingDayId: trainingDay.id,
            title: block.title,
            order: block.order,
            exercises: {
              create: block.exercises.map((ex, idx) => ({
                order: idx + 1,
                targetSets: ex.sets ?? null,
                targetReps: ex.reps ?? null,
                restSeconds: ex.restSeconds ?? null,
                exercise: { connect: { id: exerciseIdByName.get(ex.name)! } },
              })),
            },
          },
        });
      }
    });
  }
}

async function main() {
  console.log("first")
  const userIdArg = process.argv.find((a) => a.startsWith("--userId="));
  if (!userIdArg) {
    throw new Error(
      "Falta --userId=... Ej: ts-node prisma/seedRoutine.ts --userId=ckxxxx",
    );
  }
  const userId = userIdArg.split("=")[1];

  // sanity check: el usuario existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) throw new Error(`No existe User con id=${userId}`);

  await seedRoutineForUser(userId);
  console.log("✅ Rutina cargada OK para userId:", userId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
