-- CreateTable
CREATE TABLE "TravelOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "destination" TEXT NOT NULL,
    "purpose" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "vehicleId" TEXT,
    "initialKm" REAL DEFAULT 0,
    "finalKm" REAL DEFAULT 0,
    "fuelPrice" REAL DEFAULT 0,
    "advanceDeduction" REAL DEFAULT 0,
    "exchangeRate" REAL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "startPlace" TEXT NOT NULL,
    "endPlace" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CZ',
    "breakfast" BOOLEAN NOT NULL DEFAULT false,
    "lunch" BOOLEAN NOT NULL DEFAULT false,
    "dinner" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ItineraryDay_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TravelOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Advance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CZK',
    CONSTRAINT "Advance_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TravelOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CZK',
    CONSTRAINT "Expense_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TravelOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RateSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT,
    "baseRate" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CZK'
);
