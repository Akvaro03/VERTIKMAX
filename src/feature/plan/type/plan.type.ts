import { Weekday } from "@/generated/prisma/enums";

export type planType = {
  createdAt: Date;
  days: dayType[];
  id: string;
  isActive: boolean;
  name: string;
  updatedAt: Date;
  userId: string;
};
export type dayType = {
  blocks: blocksType[];
  createdAt: Date;
  day: Weekday;
  id: string;
  name: string;
  planId: string;
  updatedAt: Date;
};
export type blocksType = {
  createdAt: Date;
  exercises: exerciseType[];
  id: string;
  order: number;
  planDayId: string;
  title: string;
  updatedAt: Date;
};
export type exerciseType = {
  blockId: string;
  exercise: exerciseDataType;
  exerciseId: string;
  id: string;
  order: number;
  restSeconds: number;
  targetReps: string;
  targetSets: number;
};
export type exerciseDataType = {
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  updatedAt: Date;
  userId: string;
};
