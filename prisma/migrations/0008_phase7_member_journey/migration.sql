-- CreateTable
CREATE TABLE "MemberJourney" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "journeyTemplateId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "currentStage" TEXT NOT NULL DEFAULT 'DAY_0',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedTrainerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MemberJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyTask" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" TEXT NOT NULL,
    "assignedRole" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "escalationRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberJourney_gymId_status_currentStage_idx" ON "MemberJourney"("gymId", "status", "currentStage");

-- CreateIndex
CREATE INDEX "MemberJourney_memberId_status_idx" ON "MemberJourney"("memberId", "status");

-- CreateIndex
CREATE INDEX "JourneyTask_journeyId_status_dueDate_idx" ON "JourneyTask"("journeyId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "JourneyTask_memberId_dueDate_idx" ON "JourneyTask"("memberId", "dueDate");

-- CreateIndex
CREATE INDEX "JourneyTask_assignedUserId_status_dueDate_idx" ON "JourneyTask"("assignedUserId", "status", "dueDate");

-- AddForeignKey
ALTER TABLE "MemberJourney" ADD CONSTRAINT "MemberJourney_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberJourney" ADD CONSTRAINT "MemberJourney_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberJourney" ADD CONSTRAINT "MemberJourney_assignedTrainerId_fkey" FOREIGN KEY ("assignedTrainerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "MemberJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

