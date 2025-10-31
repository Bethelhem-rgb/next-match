/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_sourceMemberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_targetMemberId_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_sourceMemberId_fkey" FOREIGN KEY ("sourceMemberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_targetMemberId_fkey" FOREIGN KEY ("targetMemberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
