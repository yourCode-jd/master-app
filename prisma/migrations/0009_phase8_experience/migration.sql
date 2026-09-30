-- CreateTable
CREATE TABLE "MemberFeedback" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "sentiment" TEXT NOT NULL,
    "primaryReason" TEXT,
    "secondaryReasons" TEXT,
    "freeText" TEXT,
    "relatedTrainerId" TEXT,
    "relatedEquipmentId" TEXT,
    "relatedZoneId" TEXT,
    "relatedVisitId" TEXT,
    "requestReason" TEXT,
    "confidential" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "feedbackId" TEXT,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relatedTrainerId" TEXT,
    "relatedEquipmentId" TEXT,
    "relatedZoneId" TEXT,
    "assignedToUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscomfortReport" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "bodyArea" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "dateReported" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggeringExercise" TEXT,
    "temporaryModification" TEXT,
    "trainerNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "followUpDate" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "DiscomfortReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberFeedback_gymId_sentiment_createdAt_idx" ON "MemberFeedback"("gymId", "sentiment", "createdAt");

-- CreateIndex
CREATE INDEX "MemberFeedback_memberId_createdAt_idx" ON "MemberFeedback"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "Complaint_gymId_status_severity_idx" ON "Complaint"("gymId", "status", "severity");

-- CreateIndex
CREATE INDEX "Complaint_memberId_createdAt_idx" ON "Complaint"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "DiscomfortReport_gymId_status_followUpDate_idx" ON "DiscomfortReport"("gymId", "status", "followUpDate");

-- CreateIndex
CREATE INDEX "DiscomfortReport_memberId_dateReported_idx" ON "DiscomfortReport"("memberId", "dateReported");

-- AddForeignKey
ALTER TABLE "MemberFeedback" ADD CONSTRAINT "MemberFeedback_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberFeedback" ADD CONSTRAINT "MemberFeedback_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscomfortReport" ADD CONSTRAINT "DiscomfortReport_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscomfortReport" ADD CONSTRAINT "DiscomfortReport_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
