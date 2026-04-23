-- Drop legacy fields from Track table
ALTER TABLE "Track" DROP COLUMN "level";
ALTER TABLE "Track" DROP COLUMN "zone";
ALTER TABLE "Track" DROP COLUMN "holdColor";