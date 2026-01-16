"use server";
import prisma from "@/lib/prisma";

async function createExercise({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const exercise = prisma.exercise.create({
    data: {
      name,
      userId: "cmkfi7wdo000074druqcsgf8x",
      description,
    },
  });
  console.log(exercise)
  return exercise;
}

export default createExercise;
