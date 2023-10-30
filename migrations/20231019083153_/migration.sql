/*
  Warnings:

  - You are about to drop the `GroupInvites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupInvites" DROP CONSTRAINT "GroupInvites_createdById_fkey";

-- DropForeignKey
ALTER TABLE "GroupInvites" DROP CONSTRAINT "GroupInvites_groupId_fkey";

-- DropTable
DROP TABLE "GroupInvites";

-- CreateTable
CREATE TABLE "GroupInvite" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "response" TEXT NOT NULL DEFAULT '',
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "GroupInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
