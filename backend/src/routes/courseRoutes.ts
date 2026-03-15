import { Router } from 'express';
import { createCourse, getAllCourses, getCourseBySlug } from '../controllers/courseController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Endpoint Publik: Daftar semua course + Ngeliat detail 1 course (Tapi video gakan diputer kalo no-auth)
router.get('/', getAllCourses);

// Harus pake token buat ngeliat isinya (Karna getCourseBySlug butuh ngecek Role / Kepemilikan)
router.get('/:slug', authenticateToken, getCourseBySlug);

// Endpoint Private (Cuma Admin yang bisa nambah / edit kelas baru)
router.post(
  '/', 
  authenticateToken, 
  requireRole(['SUPER_ADMIN']), 
  createCourse
);

export default router;
