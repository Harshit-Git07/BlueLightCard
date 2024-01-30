DO $$ BEGIN
 CREATE TYPE "affiliate" AS ENUM('awin', 'affiliateFuture', 'rakuten', 'affilinet', 'webgains', 'partnerize', 'impactRadius', 'adtraction', 'affiliateGateway', 'optimiseMedia', 'commissionJunction', 'tradedoubler');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "connection" AS ENUM('affiliate', 'direct', 'spotify');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "integration" AS ENUM('eagleeye', 'uniqodo');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "offerType" AS ENUM('online', 'in-store');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "platform" AS ENUM('BLC_UK', 'BLC_AU', 'DDS_UK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "redemptionType" AS ENUM('generic', 'vault');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('active', 'in-active');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "generics" (
	"id" varchar PRIMARY KEY NOT NULL,
	"redemptionId" varchar NOT NULL,
	"code" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "redemptions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"affiliate" "affiliate",
	"companyId" varchar NOT NULL,
	"connection" "connection" NOT NULL,
	"offerId" varchar NOT NULL,
	"offerType" "offerType" NOT NULL,
	"platform" "platform" NOT NULL,
	"redemptionType" "redemptionType" NOT NULL,
	"url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vaultBatches" (
	"id" varchar PRIMARY KEY NOT NULL,
	"vaultId" varchar NOT NULL,
	"file" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vaultCodes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"vaultId" varchar NOT NULL,
	"batchId" varchar NOT NULL,
	"code" varchar NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"expiry" timestamp NOT NULL,
	"memberId" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vaults" (
	"id" varchar PRIMARY KEY NOT NULL,
	"redemptionId" varchar NOT NULL,
	"alertBelow" integer DEFAULT 100 NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"integration" "integration",
	"integrationId" integer,
	"maxPerUser" integer,
	"boolean" boolean DEFAULT false NOT NULL,
	"status" "status" NOT NULL,
	"terms" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "generics" ADD CONSTRAINT "generics_redemptionId_redemptions_id_fk" FOREIGN KEY ("redemptionId") REFERENCES "redemptions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultBatches" ADD CONSTRAINT "vaultBatches_vaultId_vaults_id_fk" FOREIGN KEY ("vaultId") REFERENCES "vaults"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultCodes" ADD CONSTRAINT "vaultCodes_vaultId_vaults_id_fk" FOREIGN KEY ("vaultId") REFERENCES "vaults"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultCodes" ADD CONSTRAINT "vaultCodes_batchId_vaultBatches_id_fk" FOREIGN KEY ("batchId") REFERENCES "vaultBatches"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaults" ADD CONSTRAINT "vaults_redemptionId_redemptions_id_fk" FOREIGN KEY ("redemptionId") REFERENCES "redemptions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
