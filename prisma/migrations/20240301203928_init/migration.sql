-- CreateTable
CREATE TABLE "Player" (
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "lastseen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TestPlayer" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TestPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_uuid_key" ON "Player"("uuid");
