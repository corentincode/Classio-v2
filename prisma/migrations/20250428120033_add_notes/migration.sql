-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('CONTROLE', 'DEVOIR', 'EXAMEN', 'TP', 'ORAL', 'PROJET', 'AUTRE');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('TRIMESTRE_1', 'TRIMESTRE_2', 'TRIMESTRE_3', 'SEMESTRE_1', 'SEMESTRE_2', 'ANNEE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "PeriodConfig" (
    "id" TEXT NOT NULL,
    "period" "Period" NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "schoolYear" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "PeriodConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EvaluationType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "maxGrade" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "periodId" TEXT,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "isAbsent" BOOLEAN NOT NULL DEFAULT false,
    "isExcused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "gradedById" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeriodConfig_period_schoolYear_establishmentId_key" ON "PeriodConfig"("period", "schoolYear", "establishmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_evaluationId_key" ON "Grade"("studentId", "evaluationId");

-- AddForeignKey
ALTER TABLE "PeriodConfig" ADD CONSTRAINT "PeriodConfig_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "PeriodConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
