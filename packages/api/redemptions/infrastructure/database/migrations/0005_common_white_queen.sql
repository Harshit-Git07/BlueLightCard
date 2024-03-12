DO $$ BEGIN
 CREATE TYPE "vaultType" AS ENUM('standard', 'legacy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "vaultCodes" ALTER COLUMN "memberId" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "vaults" ADD COLUMN "vaultType" "vaultType" DEFAULT 'standard' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vault_idx" ON "vaultCodes" ("vaultId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "batch_idx" ON "vaultCodes" ("batchId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_idx" ON "vaultCodes" ("created");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expiry_idx" ON "vaultCodes" ("expiry");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_idx" ON "vaultCodes" ("memberId");