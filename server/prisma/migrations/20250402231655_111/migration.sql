/*
  Warnings:

  - You are about to drop the column `CreateAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "CreateAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
