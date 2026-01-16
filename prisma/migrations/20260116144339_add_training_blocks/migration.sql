/*
  Warnings:

  - You are about to drop the `TrainingDayExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainingDayExercise" DROP CONSTRAINT "TrainingDayExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingDayExercise" DROP CONSTRAINT "TrainingDayExercise_trainingDayId_fkey";

-- DropTable
DROP TABLE "TrainingDayExercise";

-- CreateTable
CREATE TABLE "TrainingBlock" (
    "id" TEXT NOT NULL,
    "trainingDayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingBlockExercise" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "targetSets" INTEGER,
    "targetReps" TEXT,
    "restSeconds" INTEGER,

    CONSTRAINT "TrainingBlockExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingBlock_trainingDayId_order_idx" ON "TrainingBlock"("trainingDayId", "order");

-- CreateIndex
CREATE INDEX "TrainingBlockExercise_blockId_order_idx" ON "TrainingBlockExercise"("blockId", "order");

-- CreateIndex
CREATE INDEX "TrainingBlockExercise_exerciseId_idx" ON "TrainingBlockExercise"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingBlockExercise_blockId_exerciseId_key" ON "TrainingBlockExercise"("blockId", "exerciseId");

-- AddForeignKey
ALTER TABLE "TrainingBlock" ADD CONSTRAINT "TrainingBlock_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "TrainingDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingBlockExercise" ADD CONSTRAINT "TrainingBlockExercise_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "TrainingBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingBlockExercise" ADD CONSTRAINT "TrainingBlockExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
