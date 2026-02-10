-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "document" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "expected_close_date" TIMESTAMP(3),
ADD COLUMN     "probability" INTEGER NOT NULL DEFAULT 50;
