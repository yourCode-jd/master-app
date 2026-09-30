-- CreateTable
CREATE TABLE "FloorZone" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "zoneType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "capacity" INTEGER NOT NULL,
    "currentOccupancy" INTEGER NOT NULL DEFAULT 0,
    "busyState" TEXT NOT NULL DEFAULT 'QUIET',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FloorZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccupancySnapshot" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occupancyCount" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "occupancyPercent" INTEGER NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "OccupancySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "assetCode" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "lastMaintenanceDate" TIMESTAMP(3),
    "nextMaintenanceDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentIssue" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "reportedByUserId" TEXT,
    "issueType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REPORTED',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "assignedToUserId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,

    CONSTRAINT "EquipmentIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceTask" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "completedBy" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FloorZone_gymId_status_busyState_idx" ON "FloorZone"("gymId", "status", "busyState");

-- CreateIndex
CREATE UNIQUE INDEX "FloorZone_gymId_name_key" ON "FloorZone"("gymId", "name");

-- CreateIndex
CREATE INDEX "OccupancySnapshot_zoneId_timestamp_idx" ON "OccupancySnapshot"("zoneId", "timestamp");

-- CreateIndex
CREATE INDEX "Equipment_gymId_status_condition_idx" ON "Equipment"("gymId", "status", "condition");

-- CreateIndex
CREATE INDEX "Equipment_zoneId_status_idx" ON "Equipment"("zoneId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_gymId_assetCode_key" ON "Equipment"("gymId", "assetCode");

-- CreateIndex
CREATE INDEX "EquipmentIssue_gymId_status_severity_idx" ON "EquipmentIssue"("gymId", "status", "severity");

-- CreateIndex
CREATE INDEX "EquipmentIssue_equipmentId_reportedAt_idx" ON "EquipmentIssue"("equipmentId", "reportedAt");

-- CreateIndex
CREATE INDEX "MaintenanceTask_gymId_status_scheduledDate_idx" ON "MaintenanceTask"("gymId", "status", "scheduledDate");

-- AddForeignKey
ALTER TABLE "FloorZone" ADD CONSTRAINT "FloorZone_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupancySnapshot" ADD CONSTRAINT "OccupancySnapshot_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupancySnapshot" ADD CONSTRAINT "OccupancySnapshot_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "FloorZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "FloorZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentIssue" ADD CONSTRAINT "EquipmentIssue_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentIssue" ADD CONSTRAINT "EquipmentIssue_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTask" ADD CONSTRAINT "MaintenanceTask_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTask" ADD CONSTRAINT "MaintenanceTask_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
