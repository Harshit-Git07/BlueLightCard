CREATE TABLE IF NOT EXISTS `exclusionType` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `exclusionType_id` PRIMARY KEY(`id`),
	CONSTRAINT `exclusionType_id_unique` UNIQUE(`id`),
	CONSTRAINT `exclusionType_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `offerExclusions` (
	`id` varchar(36) NOT NULL,
	`offerId` bigint unsigned NOT NULL,
	`exclusionTypeId` varchar(36) NOT NULL,
	CONSTRAINT `offerExclusions_id` PRIMARY KEY(`id`),
	CONSTRAINT `offerExclusions_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE INDEX `offerId_idx` ON `offerExclusions` (`offerId`);--> statement-breakpoint
ALTER TABLE `offerExclusions` ADD CONSTRAINT `offerExclusions_exclusionTypeId_exclusionType_id_fk` FOREIGN KEY (`exclusionTypeId`) REFERENCES `exclusionType`(`id`) ON DELETE restrict ON UPDATE cascade;
