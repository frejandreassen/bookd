-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "name" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '';
