-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gibberish" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "dept" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "homeTown" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL DEFAULT '0000000000',
    "email" TEXT NOT NULL,
    "socialLink" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "clg" TEXT NOT NULL,
    "sec" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "birthday" DATETIME NOT NULL,
    "avatarLink" TEXT NOT NULL DEFAULT 'https://source.unsplash.com/random/500x500/?sky'
);

-- CreateTable
CREATE TABLE "UserVersion" (
    "studentId" TEXT NOT NULL DEFAULT 'AA-0000000',
    "gibberish" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "batch" INTEGER,
    "dept" TEXT,
    "bloodGroup" TEXT,
    "homeTown" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "socialLink" TEXT,
    "gender" TEXT,
    "clg" TEXT,
    "sec" TEXT,
    "active" BOOLEAN,
    "birthday" DATETIME,
    "avatarLink" TEXT,
    CONSTRAINT "UserVersion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_gibberish_key" ON "Student"("gibberish");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_socialLink_key" ON "Student"("socialLink");

-- CreateIndex
CREATE INDEX "Student_email_id_name_idx" ON "Student"("email", "id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserVersion_email_key" ON "UserVersion"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserVersion_socialLink_key" ON "UserVersion"("socialLink");
