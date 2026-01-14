-- Enable uuid generation (Supabase/Postgres)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Change Playground.id from TEXT (cuid) to UUID
ALTER TABLE "Playground" DROP CONSTRAINT "Playground_pkey";
ALTER TABLE "Playground" ADD COLUMN "id_new" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "Playground" DROP COLUMN "id";
ALTER TABLE "Playground" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Playground" ADD CONSTRAINT "Playground_pkey" PRIMARY KEY ("id");
