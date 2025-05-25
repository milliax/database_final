/*
  Warnings:

  - Added the required column `id_card_issue_date` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "id_card_image" TEXT,
ADD COLUMN     "id_card_issue_date" TIMESTAMP(3) NOT NULL;
