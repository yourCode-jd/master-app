CREATE TABLE "TrainingProgress" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "stepIndex" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "skippedSteps" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "TrainingProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingEvent" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrainingProgress_userId_scenarioId_key" ON "TrainingProgress"("userId", "scenarioId");
CREATE INDEX "TrainingProgress_gymId_status_idx" ON "TrainingProgress"("gymId", "status");
CREATE INDEX "TrainingEvent_userId_scenarioId_createdAt_idx" ON "TrainingEvent"("userId", "scenarioId", "createdAt");
CREATE INDEX "TrainingEvent_gymId_createdAt_idx" ON "TrainingEvent"("gymId", "createdAt");

ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingEvent" ADD CONSTRAINT "TrainingEvent_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingEvent" ADD CONSTRAINT "TrainingEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
