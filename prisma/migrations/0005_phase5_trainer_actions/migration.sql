-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "attentionItemId" TEXT,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "assignedToId" TEXT,
    "assignedRole" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "actionTaken" TEXT,
    "memberResponse" TEXT,
    "followUpAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "outcomeStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Intervention_gymId_status_dueAt_idx" ON "Intervention"("gymId", "status", "dueAt");

-- CreateIndex
CREATE INDEX "Intervention_memberId_createdAt_idx" ON "Intervention"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "Intervention_assignedToId_status_dueAt_idx" ON "Intervention"("assignedToId", "status", "dueAt");

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_attentionItemId_fkey" FOREIGN KEY ("attentionItemId") REFERENCES "AttentionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
