/*
  Warnings:

  - You are about to drop the column `created` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_sourceMemberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_targetMemberId_fkey";

-- AlterTable
ALTER TABLE "public"."Member" DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_sourceMemberId_fkey" FOREIGN KEY ("sourceMemberId") REFERENCES "public"."Member"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_targetMemberId_fkey" FOREIGN KEY ("targetMemberId") REFERENCES "public"."Member"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
