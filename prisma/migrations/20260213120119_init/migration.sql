/*
  Warnings:

  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
