-- --------------------------------------------------------
-- Hôte:                         ep-solitary-wave-a2filvrs-pooler.eu-central-1.postgres.vercel-storage.com
-- Version du serveur:           PostgreSQL 15.6 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
-- SE du serveur:                
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

-- Drop the everything in the database
DROP TABLE IF EXISTS "accounts";

DROP TABLE IF EXISTS "user_track_progress";
DROP INDEX IF EXISTS "idx_usertrackprogress_user_id";
DROP INDEX IF EXISTS "idx_usertrackprogress_track_id";

DROP TABLE IF EXISTS "tracks";
DROP INDEX IF EXISTS "idx_tracks_name";
DROP INDEX IF EXISTS "idx_users_id";

DROP TABLE IF EXISTS "users";
DROP INDEX IF EXISTS "idx_users_email";
DROP INDEX IF EXISTS "idx_users_id";


-- Listage de la structure de la table public. accounts
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" SERIAL NOT NULL,
	"userId" INTEGER NOT NULL,
	"type" VARCHAR(255) NOT NULL,
	"provider" VARCHAR(255) NOT NULL,
	"providerAccountId" VARCHAR(255) NOT NULL,
	"refresh_token" TEXT NULL DEFAULT NULL,
	"access_token" TEXT NULL DEFAULT NULL,
	"expires_at" BIGINT NULL DEFAULT NULL,
	"id_token" TEXT NULL DEFAULT NULL,
	"scope" TEXT NULL DEFAULT NULL,
	"session_state" TEXT NULL DEFAULT NULL,
	"token_type" TEXT NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table public. tracks
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(255) NULL DEFAULT NULL,
	"date" DATE NULL DEFAULT NULL,
	"zone" INTEGER NOT NULL,
	"points" INTEGER NOT NULL DEFAULT 0,
	"level" VARCHAR(50) NULL DEFAULT NULL,
	"imageUrl" VARCHAR(255) NULL DEFAULT '',
	"holdColor" VARCHAR(50) NULL DEFAULT NULL::character varying,
	PRIMARY KEY ("id")
);
CREATE INDEX "idx_tracks_id" ON tracks("id");
CREATE INDEX "idx_tracks_name" ON tracks("name");

DELETE FROM "tracks";
INSERT INTO "tracks" ("id", "name", "date", "level", "imageUrl", "holdColor", "zone") VALUES
  (3, 'A third and it''s the one', '2024-01-26', 'Beginner', 'SocialParoiApp/Tracks/hvupvslz92v1x89gvdc2', 'Pink', 1),
  (4, 'Legendary Track', '2024-01-31', 'Legendary', 'SocialParoiApp/Tracks/nfkywjbxwqqivo1kmi2s', 'Black', 1),
  (2, 'Test second track', '2023-12-31', 'Intermediate', '', 'Green', 4),
  (1, 'First track', '2024-01-10', 'Advanced', '', 'Yellow', 6),
  (5, 'With a very long name, I just want to see what''s happening', '2024-02-02', 'Difficult', '', 'Blue', 10),
  (6, 'Easy track', '2024-01-02', 'Easy', '', 'Purple', 2),
  (7, 'No level', '2023-11-02', 'Unknown', '', 'White', 1);

-- Listage de la structure de la table public. users
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(255) NULL DEFAULT NULL,
	"email" VARCHAR(255) NULL DEFAULT NULL,
	"emailVerified" TIMESTAMPTZ NULL DEFAULT NULL,
	"image" TEXT NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);
CREATE INDEX "idx_users_id" ON "users" ("id");
CREATE INDEX "idx_users_email" ON "users" ("email");

-- Les données exportées n'étaient pas sélectionnées.

CREATE TABLE IF NOT EXISTS "user_track_progress" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NULL DEFAULT NULL,
  "track_id" INTEGER NULL DEFAULT NULL,
  "status" TEXT NOT NULL,
  "date_completed" TIMESTAMPTZ NULL DEFAULT NULL,
  "created_at" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "usertrackprogress_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "usertrackprogress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "user_track_unique_constraint" UNIQUE (track_id, user_id)
);
CREATE INDEX "idx_usertrackprogress_user_id" ON "user_track_progress" ("user_id");
CREATE INDEX "idx_usertrackprogress_track_id" ON "user_track_progress" ("track_id");

-- Les données exportées n'étaient pas sélectionnées.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
