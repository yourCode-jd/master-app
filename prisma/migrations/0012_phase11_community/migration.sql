-- CreateTable
CREATE TABLE "CommunityGroup" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "groupType" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'OPEN',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "capacity" INTEGER,
    "trainerId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembership" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedByUserId" TEXT,
    "notes" TEXT,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupActivity" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "capacity" INTEGER,
    "trainerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "GroupActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupParticipation" (
    "id" TEXT NOT NULL,
    "groupActivityId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "checkedInAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "GroupParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "groupId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "challengeType" TEXT NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeParticipation" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "progressValue" INTEGER NOT NULL DEFAULT 0,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completionDate" TIMESTAMP(3),

    CONSTRAINT "ChallengeParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupUpdate" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityGroup_gymId_status_groupType_idx" ON "CommunityGroup"("gymId", "status", "groupType");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityGroup_gymId_name_key" ON "CommunityGroup"("gymId", "name");

-- CreateIndex
CREATE INDEX "GroupMembership_memberId_status_idx" ON "GroupMembership"("memberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembership_groupId_memberId_key" ON "GroupMembership"("groupId", "memberId");

-- CreateIndex
CREATE INDEX "GroupActivity_groupId_scheduledAt_idx" ON "GroupActivity"("groupId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "GroupParticipation_groupActivityId_memberId_key" ON "GroupParticipation"("groupActivityId", "memberId");

-- CreateIndex
CREATE INDEX "Challenge_gymId_status_endDate_idx" ON "Challenge"("gymId", "status", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeParticipation_challengeId_memberId_key" ON "ChallengeParticipation"("challengeId", "memberId");

-- AddForeignKey
ALTER TABLE "CommunityGroup" ADD CONSTRAINT "CommunityGroup_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupActivity" ADD CONSTRAINT "GroupActivity_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupActivity" ADD CONSTRAINT "GroupActivity_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipation" ADD CONSTRAINT "GroupParticipation_groupActivityId_fkey" FOREIGN KEY ("groupActivityId") REFERENCES "GroupActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipation" ADD CONSTRAINT "GroupParticipation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUpdate" ADD CONSTRAINT "GroupUpdate_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
