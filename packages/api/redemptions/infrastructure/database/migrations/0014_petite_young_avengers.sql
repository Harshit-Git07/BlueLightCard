DO $$ BEGIN
 CREATE TYPE "public"."ballotEntryStatus" AS ENUM('pending', 'unsuccessful', 'unconfirmed', 'confirmed', 'cancelled', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "redemptionType" ADD VALUE 'ballot';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ballotEntries" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"ballotId" varchar NOT NULL,
	"entryDate" timestamp NOT NULL,
	"memberId" integer NOT NULL,
	"ballotEntryStatus" "ballotEntryStatus" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ballots" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"redemptionId" varchar NOT NULL,
	"drawDate" timestamp NOT NULL,
	"totalTickets" integer DEFAULT 0 NOT NULL,
	"eventDate" timestamp NOT NULL,
	"offerName" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ballotEntries" ADD CONSTRAINT "ballotEntries_ballotId_ballots_id_fk" FOREIGN KEY ("ballotId") REFERENCES "public"."ballots"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ballots" ADD CONSTRAINT "ballots_redemptionId_redemptions_id_fk" FOREIGN KEY ("redemptionId") REFERENCES "public"."redemptions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
