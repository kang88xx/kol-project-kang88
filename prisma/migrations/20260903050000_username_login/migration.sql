-- Add username login. Backfill existing rows from the local part of the email
-- so the NOT NULL + UNIQUE constraints can be applied on a populated table.
ALTER TABLE "User" ADD COLUMN "username" TEXT;
UPDATE "User" SET "username" = lower(split_part("email", '@', 1)) WHERE "username" IS NULL;
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
