-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
