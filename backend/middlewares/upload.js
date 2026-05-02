const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${fileHash}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Ekstensi gambar tidak valid. Silakan upload gambar dengan ekstensi .jpg, .jpeg, .png, .gif, .webp, .svg",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
