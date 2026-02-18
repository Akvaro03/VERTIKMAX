"use server";

import prisma from "@/lib/prisma";
import { planType } from "../type/plan.type";

async function getOnePlanByID({ planId }: { planId: string }) {
  const userId = "cmkfi7wdo000074druqcsgf8x";
  const plans = await prisma.plan.findFirst({
    where: { userId, id: planId },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      days: { include: { blocks: { include: { exercises: {include: {exercise: true}} } } } },
    },
  });
  // Cada plan trae `days` como array con 0 o 1 elemento (por @@unique([planId, day]))
  return plans as planType | null;
}

export default getOnePlanByID;
