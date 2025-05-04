-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "workStatus" "WorkStatus";

-- DropEnum
DROP TYPE "EnumUserRole";
