-- CreateTable
CREATE TABLE "Test3PlayerAction" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL DEFAULT '',
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Test3PlayerAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test3Game" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'A',
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Test3Game_pkey" PRIMARY KEY ("id")
);
