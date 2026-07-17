/*
  Warnings:

  - A unique constraint covering the columns `[userId,symbol]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_symbol_key" ON "Portfolio"("userId", "symbol");
