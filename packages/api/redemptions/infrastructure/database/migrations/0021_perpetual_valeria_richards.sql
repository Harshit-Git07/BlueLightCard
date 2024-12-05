CREATE TYPE "public"."ballotStatus" AS ENUM('pending', 'drawing', 'drawn');--> statement-breakpoint
ALTER TABLE "ballots" ADD COLUMN "status" "ballotStatus" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bal_draw_date_idx" ON "ballots" USING btree ("drawDate");