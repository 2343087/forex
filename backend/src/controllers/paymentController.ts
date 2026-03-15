import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { snap } from '../config/midtrans';
import { z } from 'zod';

// ═══════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════
const createTransactionSchema = z.object({
  planType: z.enum(['VIP_MONTHLY', 'VIP_YEARLY'] as const, {
    message: 'Plan harus VIP_MONTHLY atau VIP_YEARLY.',
  }),
});

// ═══════════════════════════════════════
// CREATE VIP TRANSACTION
// ═══════════════════════════════════════
export const createVipTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      const errMsg = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: errMsg });
      return;
    }

    const { planType } = parsed.data;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }

    // Cek apakah ada transaksi PENDING yang belum selesai
    const pendingTrx = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) } // 30 min window
      }
    });

    if (pendingTrx) {
      res.status(400).json({
        error: 'Masih ada transaksi pending. Selesaikan dulu atau tunggu 30 menit.',
      });
      return;
    }

    const amount = planType === 'VIP_MONTHLY' ? 150000 : 1200000;
    const planName = planType === 'VIP_MONTHLY' ? 'VIP Edukasi - 1 Bulan' : 'VIP Edukasi - 1 Tahun';
    const orderId = `TRX-${planType}-${(userId).substring(0, 5)}-${Date.now()}`;

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        orderId,
        userId: user.id,
        amount,
        planType,
        status: 'PENDING'
      } as any
    });

    // Create Snap token
    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: amount },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phoneNumber || '',
      },
      item_details: [{ id: planType, price: amount, quantity: 1, name: planName }]
    };

    const snapTransaction = await snap.createTransaction(parameter);

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentUrl: snapTransaction.redirect_url }
    });

    res.status(200).json({
      token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url
    });

  } catch (error) {
    console.error('[Create VIP Transaction Error]', error);
    res.status(500).json({ error: 'Gagal membuat tagihan pembayaran.' });
  }
};

// ═══════════════════════════════════════
// MIDTRANS WEBHOOK (Signature Verified)
// ═══════════════════════════════════════
export const handleMidtransWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = data;

    // SECURITY: Verify Midtrans SHA-512 signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key) {
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest('hex');

      if (signature_key !== expectedSignature) {
        console.warn(`[Webhook] SIGNATURE MISMATCH for order ${order_id}. Possible forgery.`);
        res.status(403).json({ error: 'Invalid signature.' });
        return;
      }
    }

    console.log(`[Midtrans Webhook] Order: ${order_id} | Status: ${transaction_status}`);

    // Find transaction
    const transaction = await prisma.transaction.findUnique({ where: { orderId: order_id } });
    if (!transaction) {
      res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      return;
    }

    // Determine final status
    let finalStatus = 'PENDING';
    if (transaction_status === 'capture') {
      finalStatus = fraud_status === 'accept' ? 'SUCCESS' : 'PENDING';
    } else if (transaction_status === 'settlement') {
      finalStatus = 'SUCCESS';
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      finalStatus = 'FAILED';
    }

    // Update transaction
    await prisma.transaction.update({
      where: { orderId: order_id },
      data: {
        status: finalStatus as any,
        midtransData: data as object
      } as any
    });

    // Grant VIP on success (idempotent — won't double-grant)
    if (finalStatus === 'SUCCESS' && transaction.status !== 'SUCCESS') {
      const user = await prisma.user.findUnique({ where: { id: transaction.userId } });

      if (user) {
        const today = new Date();
        let newValidUntil = user.vipValidUntil && user.vipValidUntil > today
          ? new Date(user.vipValidUntil)
          : today;

        const txPlanType = (transaction as any).planType;
        if (txPlanType === 'VIP_MONTHLY') {
          newValidUntil.setMonth(newValidUntil.getMonth() + 1);
        } else if (txPlanType === 'VIP_YEARLY') {
          newValidUntil.setFullYear(newValidUntil.getFullYear() + 1);
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'VIP_MEMBER',
            vipValidUntil: newValidUntil
          }
        });

        console.log(`[VIP Granted] ${user.email} | Until: ${newValidUntil}`);
      }
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('[Midtrans Webhook Error]', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
