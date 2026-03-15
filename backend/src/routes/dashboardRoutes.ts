import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Endpoint untuk ngambil data ringkasan dashboard
router.get('/', authenticateToken, getDashboardData);

export default router;
