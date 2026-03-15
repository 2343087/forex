import { Router } from 'express';
import { createVipTransaction, handleMidtransWebhook } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Routes buat user beli paket VIP (Butuh login)
router.post('/vip', authenticateToken, createVipTransaction);

// Webhook dari Midtrans (Gak butuh auth soalnya ditembak server Midtrans langsung)
router.post('/webhook', handleMidtransWebhook);

export default router;
