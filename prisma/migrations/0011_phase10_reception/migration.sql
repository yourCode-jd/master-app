-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "visitType" TEXT NOT NULL,
    "expectedAt" TIMESTAMP(3) NOT NULL,
    "arrivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "assignedStaffId" TEXT,
    "assignedTrainerId" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EXPECTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberRequest" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedToId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "resolution" TEXT,

    CONSTRAINT "MemberRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessIssue" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "assignedToId" TEXT,
    "resolution" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "AccessIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftHandover" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "shiftDate" TIMESTAMP(3) NOT NULL,
    "shiftType" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),

    CONSTRAINT "ShiftHandover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visitor_gymId_status_expectedAt_idx" ON "Visitor"("gymId", "status", "expectedAt");

-- CreateIndex
CREATE INDEX "MemberRequest_gymId_status_priority_idx" ON "MemberRequest"("gymId", "status", "priority");

-- CreateIndex
CREATE INDEX "MemberRequest_memberId_createdAt_idx" ON "MemberRequest"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessIssue_gymId_status_createdAt_idx" ON "AccessIssue"("gymId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ShiftHandover_gymId_acknowledgedAt_shiftDate_idx" ON "ShiftHandover"("gymId", "acknowledgedAt", "shiftDate");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRequest" ADD CONSTRAINT "MemberRequest_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRequest" ADD CONSTRAINT "MemberRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessIssue" ADD CONSTRAINT "AccessIssue_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessIssue" ADD CONSTRAINT "AccessIssue_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftHandover" ADD CONSTRAINT "ShiftHandover_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
