/*
  Warnings:

  - You are about to drop the column `end_time` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `room_number` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "end_time",
DROP COLUMN "room_number",
DROP COLUMN "start_time",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
