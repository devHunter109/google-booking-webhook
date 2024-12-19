-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "googleEventId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "partySize" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_googleEventId_key" ON "Booking"("googleEventId");
