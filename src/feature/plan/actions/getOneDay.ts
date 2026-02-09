"use server";

import prisma from "@/lib/prisma";
import { planType } from "../type/plan.type";
import { Weekday } from "@/generated/prisma/enums";

async function getOneDay({ day }: { day: Weekday }) {
  const userId = "cmkfi7wdo000074druqcsgf8x";
  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      days: {
        where: { day },
        include: {
          blocks: {
            orderBy: { order: "asc" },
            include: {
              exercises: {
                orderBy: { order: "asc" },
                include: { exercise: true },
              },
            },
          },
        },
      },
    },
  });
  // Cada plan trae `days` como array con 0 o 1 elemento (por @@unique([planId, day]))
  return plans as planType[];
}

export default getOneDay;
