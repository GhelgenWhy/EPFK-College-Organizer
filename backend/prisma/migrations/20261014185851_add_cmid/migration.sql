/*
  Warnings:

  - A unique constraint covering the columns `[cmid]` on the table `task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cmid` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "cmid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "task_cmid_key" ON "task"("cmid");
