import multer from "multer";
import path from "path";

// Storage (local for now, can replace with S3 later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadVendorFiles = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "portfolioFiles", maxCount: 10 },
  { name: "portfolioImages", maxCount: 10 },
]);

export { upload, uploadVendorFiles };
