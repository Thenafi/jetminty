/*
  Warnings:

  - You are about to drop the `UserVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserVersion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Version" (
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
    CONSTRAINT "Version_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Version_email_key" ON "Version"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Version_socialLink_key" ON "Version"("socialLink");
