/*
  Warnings:

  - You are about to drop the column `feedback` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConsultationStatus" ADD VALUE 'CHECKED_IN';
ALTER TYPE "ConsultationStatus" ADD VALUE 'NO_SHOW';

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "feedback",
DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "appointmentId",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "consultationId" TEXT,
ADD COLUMN     "rating" INTEGER;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
