CREATE TABLE IF NOT EXISTS "integrationCodes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"vaultId" varchar NOT NULL,
	"code" varchar NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"expiry" timestamp NOT NULL,
	"memberId" varchar NOT NULL,
	"integrationId" varchar NOT NULL,
	"integration" "integration" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integrationCodes" ADD CONSTRAINT "integrationCodes_vaultId_vaults_id_fk" FOREIGN KEY ("vaultId") REFERENCES "public"."vaults"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ic_vault_idx" ON "integrationCodes" ("vaultId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ic_member_idx" ON "integrationCodes" ("memberId");