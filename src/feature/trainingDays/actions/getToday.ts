"use server";

import { Weekday } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";
import getTodayName from "@/utilts/getTodayName";
import { TrainingDayWithBlocks } from "./getDays";

async function getToday() {
  const today = getTodayName();

  const exercise = await prisma.trainingDay.findFirst({
    where: {
      userId: "cmkfi7wdo000074druqcsgf8x",
      day: today as Weekday,
    },
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
  return exercise as TrainingDayWithBlocks;
}

export default getToday;
