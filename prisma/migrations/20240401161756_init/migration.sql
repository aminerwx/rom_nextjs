-- CreateTable
CREATE TABLE "Console" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL,

    CONSTRAINT "Console_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "release" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rom" (
    "sha256" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "crc" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "sha1" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Rom_pkey" PRIMARY KEY ("sha256")
);

-- CreateIndex
CREATE UNIQUE INDEX "Console_url_key" ON "Console"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Rom_filename_key" ON "Rom"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Rom_crc_key" ON "Rom"("crc");

-- CreateIndex
CREATE UNIQUE INDEX "Rom_md5_key" ON "Rom"("md5");

-- CreateIndex
CREATE UNIQUE INDEX "Rom_sha1_key" ON "Rom"("sha1");

-- CreateIndex
CREATE UNIQUE INDEX "rom_url_unique_constraint" ON "Rom"("sha256", "url");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Console"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rom" ADD CONSTRAINT "Rom_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rom" ADD CONSTRAINT "Rom_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Console"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
