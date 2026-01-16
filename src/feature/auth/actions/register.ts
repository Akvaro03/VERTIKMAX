"use server";

import prisma from "@/lib/prisma";

async function register() {
  const user = prisma.user.create({
    data: {
      email: "<email>",
      name: "<name>",
      createdAt: new Date(),
    },
  });
  console.log(user);
  return user;
}

export default register;
