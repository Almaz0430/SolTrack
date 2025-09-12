-- CreateTable
CREATE TABLE "drops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "mintedSupply" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artistRoyalty" TEXT NOT NULL,
    "platformFee" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "musicUrl" TEXT
);
