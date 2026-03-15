import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/uploadController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import fs from 'fs';

const router = Router();

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer buat nyimpen file
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB biar ga penuh server
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Cuma boleh upload gambar (JPG/PNG/dll)!'));
    }
  }
});

// Route /api/upload khusus Admin/Analyst
router.post(
  '/', 
  authenticateToken, 
  requireRole(['SUPER_ADMIN', 'ANALYST']), 
  upload.single('image'), 
  uploadImage
);

export default router;
