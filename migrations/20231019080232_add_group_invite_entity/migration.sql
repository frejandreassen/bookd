/*
  Warnings:

  - You are about to drop the column `invitedEmail` on the `GroupMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupMembership" DROP COLUMN "invitedEmail";

-- CreateTable
CREATE TABLE "GroupInvites" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "GroupInvites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupInvites" ADD CONSTRAINT "GroupInvites_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvites" ADD CONSTRAINT "GroupInvites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
