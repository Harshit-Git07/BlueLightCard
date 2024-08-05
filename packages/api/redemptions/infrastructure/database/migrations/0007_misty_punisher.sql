ALTER TABLE "vaultBatches" ADD COLUMN "expiry" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vaultBatches" ADD COLUMN "created" timestamp DEFAULT now() NOT NULL;
