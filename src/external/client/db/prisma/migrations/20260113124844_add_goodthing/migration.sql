-- CreateTable
CREATE TABLE "GoodThing" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "text" VARCHAR(140) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodThing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoodThing_date_isPublic_idx" ON "GoodThing"("date", "isPublic");

-- CreateIndex
CREATE INDEX "GoodThing_userId_date_idx" ON "GoodThing"("userId", "date");

-- AddForeignKey
ALTER TABLE "GoodThing" ADD CONSTRAINT "GoodThing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
