import { Router } from 'express';
import { createDailyResearch, getAllDailyResearch, deleteDailyResearch, getDailyResearchById, updateDailyResearch } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Endpoint khusus Admin/Analyst untuk posting analisa harian
router.post(
  '/research', 
  authenticateToken, 
  requireRole(['SUPER_ADMIN', 'ANALYST']), 
  createDailyResearch
);

router.get('/research', authenticateToken, requireRole(['SUPER_ADMIN', 'ANALYST']), getAllDailyResearch);
router.get('/research/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ANALYST']), getDailyResearchById);
router.put('/research/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ANALYST']), updateDailyResearch);
router.delete('/research/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ANALYST']), deleteDailyResearch);

import { createCourse, deleteCourse, getAllCourses, getCourseByIdForAdmin, updateCourse } from '../controllers/courseController';

// Admin CRUD Courses (Pindah ke sini biar sekalian secure)
router.post('/courses', authenticateToken, requireRole(['SUPER_ADMIN']), createCourse);
router.get('/courses/:id', authenticateToken, requireRole(['SUPER_ADMIN']), getCourseByIdForAdmin);
router.put('/courses/:id', authenticateToken, requireRole(['SUPER_ADMIN']), updateCourse);
router.delete('/courses/:id', authenticateToken, requireRole(['SUPER_ADMIN']), deleteCourse);

// Admin Analytics
import { getAnalytics } from '../controllers/analyticsController';
router.get('/analytics', authenticateToken, requireRole(['SUPER_ADMIN']), getAnalytics);

export default router;
