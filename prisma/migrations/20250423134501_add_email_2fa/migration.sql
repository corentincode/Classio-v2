-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorCode" TEXT,
ADD COLUMN     "twoFactorCodeExpiry" TIMESTAMP(3);
