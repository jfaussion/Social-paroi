-- --------------------------------------------------------
-- Hôte:                         ep-solitary-wave-a2filvrs-pooler.eu-central-1.postgres.vercel-storage.com
-- Version du serveur:           PostgreSQL 15.6 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
-- SE du serveur:                
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage de la structure de la table public. accounts
DROP TABLE IF EXISTS "accounts";
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

-- Listage de la structure de la table public. sessions
DROP TABLE IF EXISTS "sessions";
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" SERIAL NOT NULL,
	"userId" INTEGER NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	"sessionToken" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table public. tracks
DROP TABLE IF EXISTS "tracks";
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(255) NULL DEFAULT NULL,
	"date" DATE NULL DEFAULT NULL,
	"level" VARCHAR(50) NULL DEFAULT NULL,
	"imageUrl" VARCHAR(255) NULL DEFAULT '',
	"holdColor" VARCHAR(50) NULL DEFAULT NULL::character varying,
	INDEX "idx_track_name" ("name"),
	PRIMARY KEY ("id"),
	INDEX "climbing_track_id_index" ("id")
);

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table public. users
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(255) NULL DEFAULT NULL,
	"email" VARCHAR(255) NULL DEFAULT NULL,
	"emailVerified" TIMESTAMPTZ NULL DEFAULT NULL,
	"image" TEXT NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table public. verification_token
DROP TABLE IF EXISTS "verification_token";
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	"token" TEXT NOT NULL,
	PRIMARY KEY ("identifier", "token")
);

-- Les données exportées n'étaient pas sélectionnées.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
