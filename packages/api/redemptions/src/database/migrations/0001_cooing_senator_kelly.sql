-- Rename boolean column to showQR
ALTER TABLE "vaults" RENAME COLUMN "boolean" TO "showQR";--> statement-breakpoint

-- Cast companyId column to integer
ALTER TABLE "redemptions" ADD COLUMN "tempCompanyId" integer;
UPDATE "redemptions" SET "tempCompanyId" = CAST("companyId" AS integer);
ALTER TABLE "redemptions" DROP COLUMN "companyId";
ALTER TABLE "redemptions" RENAME COLUMN "tempCompanyId" TO "companyId";

-- Cast offerId column to integer
ALTER TABLE "redemptions" ADD COLUMN "tempOfferId" integer;
UPDATE "redemptions" SET "tempOfferId" = CAST("offerId" AS integer);
ALTER TABLE "redemptions" DROP COLUMN "offerId";
ALTER TABLE "redemptions" RENAME COLUMN "tempOfferId" TO "offerId";

-- Drop NOT NULL constraint on email column
ALTER TABLE "vaults" ALTER COLUMN "email" DROP NOT NULL;
