import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import { z } from 'zod';

// ═══════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.').max(100).trim(),
  phoneNumber: z.string().max(20).optional().nullable(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi.'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter.').max(128),
});

// ═══════════════════════════════════════
// GET PROFILE
// ═══════════════════════════════════════
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        role: true,
        vipValidUntil: true,
        referralCode: true,
        referredById: true,
        createdAt: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan.' });
      return;
    }

    const referralCount = await prisma.user.count({
      where: { referredById: user.id }
    });

    const transactionHistory = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderId: true,
        amount: true,
        status: true,
        planType: true,
        createdAt: true,
      } as any
    });

    res.status(200).json({ user, referralCount, transactionHistory });
  } catch (error) {
    console.error('[Profile Error]', error);
    res.status(500).json({ error: 'Gagal memuat data profil.' });
  }
};

// ═══════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      const errMsg = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: errMsg });
      return;
    }

    const { name, phoneNumber } = parsed.data;

    // IDOR Protection: Only update OWN profile (userId from JWT, not from body)
    if (phoneNumber) {
      const existingPhone = await prisma.user.findFirst({
        where: { phoneNumber, NOT: { id: userId } }
      });
      if (existingPhone) {
        res.status(400).json({ error: 'Nomor WA ini sudah dipakai akun lain.' });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phoneNumber: phoneNumber || null },
      select: {
        id: true, email: true, name: true, phoneNumber: true,
        role: true, vipValidUntil: true, referralCode: true,
      }
    });

    res.status(200).json({ message: 'Profil berhasil diperbarui!', user: updatedUser });
  } catch (error) {
    console.error('[Profile Update Error]', error);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
};

// ═══════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      const errMsg = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: errMsg });
      return;
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan.' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Password lama salah.' });
      return;
    }

    // Same password check
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      res.status(400).json({ error: 'Password baru tidak boleh sama dengan yang lama.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password berhasil diubah!' });
  } catch (error) {
    console.error('[Change Password Error]', error);
    res.status(500).json({ error: 'Gagal mengubah password.' });
  }
};
