"use server";

import { seedStrengthPlan } from "@/feature/seed/seedStrengthPlan";

async function register() {
  const user = await seedStrengthPlan("cmkfi7wdo000074druqcsgf8x");
  // const user = await seedMobilityPlan("cmkfi7wdo000074druqcsgf8x");
  // const user = prisma.user.create({
  //   data: {
  //     email: "<email>",
  //     name: "<name>",
  //     createdAt: new Date(),
  //   },
  // });
  // console.log(user);
  return user;
}

export default register;
