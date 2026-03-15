import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Semua route profile butuh login
router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);

export default router;
