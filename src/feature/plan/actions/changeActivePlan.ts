"use server"

import prisma from "@/lib/prisma";

type changeActivePlanProps = {
  newState: boolean;
  idPlan: string;
};

async function changeActivePlan({ idPlan, newState }: changeActivePlanProps) {
  try {
    return prisma.plan.update({
      where: { id: idPlan },
      data: {
        isActive: newState,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export default changeActivePlan;
