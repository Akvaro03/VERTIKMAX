"use server";

import prisma from "@/lib/prisma";

async function getExercise() {
  const exercise = await prisma.exercise.findMany({
    where: { userId: "cmkfi7wdo000074druqcsgf8x" },
  });
  
  return exercise as Exercise[];
}
export type Exercise = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default getExercise;
