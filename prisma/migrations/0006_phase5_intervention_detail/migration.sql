-- AlterTable
ALTER TABLE "Intervention" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "deduplicationKey" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "resolutionSummary" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Member intervention';

-- CreateTable
CREATE TABLE "InterventionAssignment" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "previousAssigneeId" TEXT,
    "newAssigneeId" TEXT,
    "changedByUserId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterventionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerInteraction" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "interventionId" TEXT,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterventionAssignment_interventionId_createdAt_idx" ON "InterventionAssignment"("interventionId", "createdAt");

-- CreateIndex
CREATE INDEX "TrainerInteraction_memberId_occurredAt_idx" ON "TrainerInteraction"("memberId", "occurredAt");

-- CreateIndex
CREATE INDEX "TrainerInteraction_trainerId_occurredAt_idx" ON "TrainerInteraction"("trainerId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Intervention_deduplicationKey_key" ON "Intervention"("deduplicationKey");

-- CreateIndex
CREATE INDEX "Intervention_gymId_priority_status_idx" ON "Intervention"("gymId", "priority", "status");

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterventionAssignment" ADD CONSTRAINT "InterventionAssignment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterventionAssignment" ADD CONSTRAINT "InterventionAssignment_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerInteraction" ADD CONSTRAINT "TrainerInteraction_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerInteraction" ADD CONSTRAINT "TrainerInteraction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerInteraction" ADD CONSTRAINT "TrainerInteraction_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerInteraction" ADD CONSTRAINT "TrainerInteraction_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE SET NULL ON UPDATE CASCADE;
