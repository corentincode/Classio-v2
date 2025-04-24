/*
  Warnings:

  - You are about to drop the column `twoFactorSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PROFESSEUR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFactorSecret",
ADD COLUMN     "establishmentId" TEXT;

-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstablishmentProfessor" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstablishmentProfessor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_code_key" ON "Establishment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EstablishmentProfessor_professorId_establishmentId_key" ON "EstablishmentProfessor"("professorId", "establishmentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentProfessor" ADD CONSTRAINT "EstablishmentProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentProfessor" ADD CONSTRAINT "EstablishmentProfessor_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
