ALTER TABLE "public"."redemptions" ALTER COLUMN "redemptionType" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."redemptionType";--> statement-breakpoint
CREATE TYPE "public"."redemptionType" AS ENUM('generic', 'vault', 'vaultQR', 'showCard', 'preApplied', 'ballot', 'giftCard', 'compare', 'verify');--> statement-breakpoint
ALTER TABLE "public"."redemptions" ALTER COLUMN "redemptionType" SET DATA TYPE "public"."redemptionType" USING "redemptionType"::"public"."redemptionType";