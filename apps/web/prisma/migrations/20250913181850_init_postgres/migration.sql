-- CreateEnum
CREATE TYPE "public"."DropStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PURCHASE', 'MINT', 'TRANSFER', 'REFUND', 'DROP_CREATED');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."drops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "mintedSupply" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."DropStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistRoyalty" TEXT NOT NULL,
    "platformFee" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "musicUrl" TEXT,

    CONSTRAINT "drops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" TEXT NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "buyerAddress" TEXT,
    "sellerAddress" TEXT,
    "dropId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_signature_key" ON "public"."transactions"("signature");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "public"."drops"("id") ON DELETE SET NULL ON UPDATE CASCADE;
