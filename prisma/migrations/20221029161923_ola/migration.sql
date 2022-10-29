-- CreateTable
CREATE TABLE "Student" (
    "id" STRING NOT NULL,
    "gibberish" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" STRING NOT NULL,
    "batch" INT4 NOT NULL,
    "dept" STRING NOT NULL,
    "bloodGroup" STRING NOT NULL,
    "homeTown" STRING NOT NULL,
    "phoneNumber" STRING NOT NULL DEFAULT '0000000000',
    "email" STRING NOT NULL,
    "socialLink" STRING NOT NULL,
    "gender" STRING NOT NULL,
    "clg" STRING NOT NULL,
    "sec" STRING NOT NULL,
    "active" BOOL NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "avatarLink" STRING NOT NULL DEFAULT 'https://source.unsplash.com/random/500x500/?sky',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Version" (
    "studentId" STRING NOT NULL DEFAULT 'AA-0000000',
    "gibberish" INT8 NOT NULL DEFAULT unique_rowid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" STRING,
    "batch" INT4,
    "dept" STRING,
    "bloodGroup" STRING,
    "homeTown" STRING,
    "phoneNumber" STRING,
    "email" STRING,
    "socialLink" STRING,
    "gender" STRING,
    "clg" STRING,
    "sec" STRING,
    "active" BOOL,
    "birthday" TIMESTAMP(3),
    "avatarLink" STRING,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("gibberish")
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
CREATE UNIQUE INDEX "Version_email_key" ON "Version"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Version_socialLink_key" ON "Version"("socialLink");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
