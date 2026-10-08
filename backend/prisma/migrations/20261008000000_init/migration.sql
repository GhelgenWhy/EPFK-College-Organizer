-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_surname" TEXT NOT NULL,
    "token" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "group_id" INTEGER,
    "status_id" INTEGER,
    "last_sync" TIMESTAMPTZ(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipline" (
    "id" SERIAL NOT NULL,
    "moodle_id" INTEGER NOT NULL,
    "discipline_name" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,

    CONSTRAINT "discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "moodle_id" INTEGER NOT NULL,
    "task_name" TEXT NOT NULL,
    "deadline" TIMESTAMPTZ(3),
    "description" TEXT,
    "added_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discipline_id" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_disciplines" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "discipline_id" INTEGER NOT NULL,

    CONSTRAINT "users_disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_tasks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ(3) NOT NULL,
    "place" TEXT,
    "description" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_group_name_key" ON "group"("group_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_group_id_idx" ON "user"("group_id");

-- CreateIndex
CREATE INDEX "user_status_id_idx" ON "user"("status_id");

-- CreateIndex
CREATE UNIQUE INDEX "discipline_moodle_id_key" ON "discipline"("moodle_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_moodle_id_key" ON "task"("moodle_id");

-- CreateIndex
CREATE INDEX "task_discipline_id_idx" ON "task"("discipline_id");

-- CreateIndex
CREATE INDEX "users_disciplines_discipline_id_idx" ON "users_disciplines"("discipline_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_disciplines_user_id_discipline_id_key" ON "users_disciplines"("user_id", "discipline_id");

-- CreateIndex
CREATE INDEX "users_tasks_task_id_idx" ON "users_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_tasks_user_id_task_id_key" ON "users_tasks"("user_id", "task_id");

-- CreateIndex
CREATE INDEX "schedule_group_id_idx" ON "schedule"("group_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_disciplines" ADD CONSTRAINT "users_disciplines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_disciplines" ADD CONSTRAINT "users_disciplines_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_tasks" ADD CONSTRAINT "users_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_tasks" ADD CONSTRAINT "users_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
