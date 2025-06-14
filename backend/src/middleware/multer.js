import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureFolderExists = async (folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Gagal membuat folder: ${folderPath}`);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath = "/tmp/";

    if (file.mimetype.startsWith("image")) {
      folderPath += "images";
    } else if (file.mimetype.startsWith("video")) {
      folderPath += "videos";
    } else {
      return cb(new Error("File harus berupa gambar atau video!"), false);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "File harus berupa gambar (jpeg, jpg, png, gif) atau video (mp4, avi, mkv)!"
      ),
      false
    );
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});
