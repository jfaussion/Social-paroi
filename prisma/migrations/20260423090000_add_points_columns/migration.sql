-- AlterTable: add points to difficulty_levels (IF NOT EXISTS guards against re-run)
ALTER TABLE "difficulty_levels" ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add points to Track (IF NOT EXISTS guards against re-run)
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 0;
