// src/utils/upload.utils.ts
import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";

// Make the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define the profile images directory
const profileImagesDir = path.join(uploadDir, "profile-images");
if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir, { recursive: true });
}

// Define storage for profile images
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, profileImagesDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Define file filter
const fileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  const fileTypes = /jpeg|jpg|png|gif/;

  // Check extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime type
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Create the multer upload instance
const uploadProfileImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

export { uploadProfileImage };
