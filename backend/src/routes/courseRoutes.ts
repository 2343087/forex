import { Router } from 'express';
import { createCourse, getAllCourses, getCourseBySlug, getCourseCategories } from '../controllers/courseController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Endpoint Publik
router.get('/', getAllCourses);
router.get('/categories', getCourseCategories);

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
