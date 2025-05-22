/*
  Warnings:

  - The `author` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sender` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "author",
ADD COLUMN     "author" JSONB,
DROP COLUMN "sender",
ADD COLUMN     "sender" JSONB;
