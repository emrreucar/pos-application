import multer from "multer";
import fs from "fs";
import path from "path";

// Multer konfigürasyonu
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // recursive: true, alt dizinleri de oluşturur
  }
};

const getUploadPath = (fieldname) => {
  const basePath = "uploads/";

  const map = {
    productImage: "uploads/products/",
    bannerImage: "uploads/banners/",
  };

  const uploadPath = map[fieldname] || basePath;
  createFolderIfNotExists(uploadPath);
  return uploadPath;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb: callback
    const uploadPath = getUploadPath(file.fieldname);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png
    const base =
      file.fieldname + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + ext);
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

// Sadece resim formatlarını kabul et
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Desteklenmeyen resim formatı: " + file.mimetype), false);
  }
};

export const uploadFiles = (fields) => {
  return multer({ storage, fileFilter }).fields(fields);
};
