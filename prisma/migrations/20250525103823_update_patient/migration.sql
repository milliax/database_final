/*
  Warnings:

  - A unique constraint covering the columns `[id_card_number]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birth_date` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_card_number` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_card_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_card_number_key" ON "Patient"("id_card_number");
