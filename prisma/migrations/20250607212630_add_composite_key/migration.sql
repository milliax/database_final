/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,day,slot]` on the table `ConsultingRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConsultingRoom_doctorId_day_slot_key" ON "ConsultingRoom"("doctorId", "day", "slot");
