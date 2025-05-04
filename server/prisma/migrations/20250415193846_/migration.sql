-- CreateEnum
CREATE TYPE "EnumUserRole" AS ENUM ('ADMIN', 'MANAGER', 'CLIENT', 'SERVICE_EMPLOYEE');

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "duration" INTEGER;
