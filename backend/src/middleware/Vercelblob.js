import { put } from '@vercel/blob';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


export async function uploadFile(file) {
  if (!file) throw new Error("File tidak ditemukan");

  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Format file tidak diizinkan.");
  }

  const blob = await put(file.originalname, file.buffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.mimetype,
    addRandomSuffix: true,
  });

  return blob.url;
}

