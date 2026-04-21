/*
  Warnings:

  - You are about to drop the column `r2ObjectKey` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `r2ObjectKey` on the `Voice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,variant]` on the table `Voice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "r2ObjectKey",
ADD COLUMN     "objectKey" TEXT;

-- AlterTable
ALTER TABLE "Voice" DROP COLUMN "r2ObjectKey",
ADD COLUMN     "objectKey" TEXT;

-- CreateIndex
CREATE INDEX "Generation_objectKey_idx" ON "Generation"("objectKey");

-- CreateIndex
CREATE INDEX "Voice_objectKey_idx" ON "Voice"("objectKey");

-- CreateIndex
CREATE UNIQUE INDEX "Voice_name_variant_key" ON "Voice"("name", "variant");
