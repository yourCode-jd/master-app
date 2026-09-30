-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "outcomeStatus" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluationWindowStart" TIMESTAMP(3) NOT NULL,
    "evaluationWindowEnd" TIMESTAMP(3) NOT NULL,
    "beforeSnapshot" TEXT NOT NULL,
    "afterSnapshot" TEXT NOT NULL,
    "primaryMetric" TEXT NOT NULL,
    "beforeValue" DECIMAL(12,3),
    "afterValue" DECIMAL(12,3),
    "changeValue" DECIMAL(12,3),
    "changePercent" DECIMAL(8,2),
    "evaluatorUserId" TEXT NOT NULL,
    "notes" TEXT,
    "nextAction" TEXT,
    "businessImpactType" TEXT,
    "businessImpactValue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_interventionId_key" ON "Outcome"("interventionId");

-- CreateIndex
CREATE INDEX "Outcome_gymId_outcomeStatus_evaluationDate_idx" ON "Outcome"("gymId", "outcomeStatus", "evaluationDate");

-- CreateIndex
CREATE INDEX "Outcome_memberId_evaluationDate_idx" ON "Outcome"("memberId", "evaluationDate");

-- CreateIndex
CREATE INDEX "Outcome_evaluatorUserId_evaluationDate_idx" ON "Outcome"("evaluatorUserId", "evaluationDate");

-- CreateIndex
CREATE INDEX "Notification_gymId_createdAt_idx" ON "Notification"("gymId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_evaluatorUserId_fkey" FOREIGN KEY ("evaluatorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

