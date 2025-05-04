/*
  Warnings:

  - Made the column `endDate` on table `applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `services` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "duration" SET NOT NULL;
