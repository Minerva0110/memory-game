-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER,
    "moves" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);
