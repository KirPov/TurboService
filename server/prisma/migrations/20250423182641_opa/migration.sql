-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'CHECK', 'READY');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "assignedEmployeeId" INTEGER;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
