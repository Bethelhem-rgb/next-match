/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Member" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
