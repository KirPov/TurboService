/*
  Warnings:

  - You are about to drop the column `descriprion` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "descriprion",
ADD COLUMN     "description" TEXT;
