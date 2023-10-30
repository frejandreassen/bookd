/*
  Warnings:

  - Added the required column `color` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
