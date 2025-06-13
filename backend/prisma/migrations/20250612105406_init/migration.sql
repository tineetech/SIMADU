-- CreateEnum
CREATE TYPE "Role" AS ENUM ('guest', 'admin');

-- CreateEnum
CREATE TYPE "TrxStatus" AS ENUM ('pending', 'proses', 'success');

-- CreateEnum
CREATE TYPE "LaporanCategory" AS ENUM ('jalan_rusak', 'sampah_menumpuk', 'pju_mati', 'banjir', 'lainnya');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('ai', 'automatic', 'manual');

-- CreateEnum
CREATE TYPE "LaporanStatus" AS ENUM ('pending', 'proses', 'failed', 'success');

-- CreateEnum
CREATE TYPE "PostinganType" AS ENUM ('text', 'image', 'video', 'polling');

-- CreateEnum
CREATE TYPE "PostinganStatus" AS ENUM ('active', 'draft');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'resolved', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "phone" BIGINT,
    "role" "Role" NOT NULL DEFAULT 'guest',
    "password" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "google_id" TEXT,
    "verify_email_token" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Koin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Koin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionKoin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "method_target" TEXT NOT NULL,
    "method_pay" TEXT,
    "success_convert_amount" INTEGER,
    "status" "TrxStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionKoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "location_latitude" TEXT NOT NULL,
    "location_longitude" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "category" "LaporanCategory" NOT NULL DEFAULT 'lainnya',
    "type_verification" "VerificationType" NOT NULL DEFAULT 'ai',
    "status" "LaporanStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "laporan_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postingan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "PostinganType" NOT NULL DEFAULT 'text',
    "content" TEXT NOT NULL,
    "status" "PostinganStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Postingan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganImage" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganVideo" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "url_video" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganPollingOption" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganPollingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganPollingVote" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganPollingVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganLike" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganReport" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganComment" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostinganComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganCommentReply" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_reply_id" INTEGER,

    CONSTRAINT "PostinganCommentReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Koin_user_id_key" ON "Koin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostinganVideo_post_id_key" ON "PostinganVideo"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostinganPollingVote_option_id_user_id_key" ON "PostinganPollingVote"("option_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostinganLike_post_id_user_id_key" ON "PostinganLike"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_comment_post" ON "PostinganComment"("post_id");

-- CreateIndex
CREATE INDEX "idx_comment_user" ON "PostinganComment"("user_id");

-- CreateIndex
CREATE INDEX "idx_reply_comment" ON "PostinganCommentReply"("comment_id");

-- CreateIndex
CREATE INDEX "idx_reply_user" ON "PostinganCommentReply"("user_id");

-- AddForeignKey
ALTER TABLE "Koin" ADD CONSTRAINT "Koin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionKoin" ADD CONSTRAINT "TransactionKoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "Laporan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postingan" ADD CONSTRAINT "Postingan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganImage" ADD CONSTRAINT "PostinganImage_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganVideo" ADD CONSTRAINT "PostinganVideo_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganPollingOption" ADD CONSTRAINT "PostinganPollingOption_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganPollingVote" ADD CONSTRAINT "PostinganPollingVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PostinganPollingOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganPollingVote" ADD CONSTRAINT "PostinganPollingVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganLike" ADD CONSTRAINT "PostinganLike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganLike" ADD CONSTRAINT "PostinganLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganReport" ADD CONSTRAINT "PostinganReport_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganReport" ADD CONSTRAINT "PostinganReport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganComment" ADD CONSTRAINT "PostinganComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganComment" ADD CONSTRAINT "PostinganComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganCommentReply" ADD CONSTRAINT "PostinganCommentReply_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "PostinganComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganCommentReply" ADD CONSTRAINT "PostinganCommentReply_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganCommentReply" ADD CONSTRAINT "PostinganCommentReply_parent_reply_id_fkey" FOREIGN KEY ("parent_reply_id") REFERENCES "PostinganCommentReply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
