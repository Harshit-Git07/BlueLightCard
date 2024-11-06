ALTER TABLE "ballotEntries" ALTER COLUMN "memberId" SET DATA TYPE varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ba_ballot_idx" ON "ballotEntries" ("ballotId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ba_member_idx" ON "ballotEntries" ("memberId");