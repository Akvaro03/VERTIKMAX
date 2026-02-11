"use server";

import prisma from "@/lib/prisma";

async function getPlans() {
  const plans = prisma.plan.findMany({
    include: {
      days: { include: { blocks: { include: { exercises: true } } } },
    },
  });
  return plans;
}

export default getPlans;
