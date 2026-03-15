import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { z } from 'zod';

// ═══════════════════════════════════════
// ZOD SCHEMAS — Input validation layer
// ═══════════════════════════════════════
const registerSchema = z.object({
  email: z.string().email('Format email tidak valid.').max(255).trim().toLowerCase(),
  password: z.string().min(8, 'Password minimal 8 karakter.').max(128),
  name: z.string().min(2, 'Nama minimal 2 karakter.').max(100).trim(),
  phoneNumber: z.string().max(20).optional().nullable(),
  referralCode: z.string().max(20).optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid.').max(255).trim().toLowerCase(),
  password: z.string().min(1, 'Password wajib diisi.').max(128),
});

// ═══════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validasi input dengan Zod (anti injection, sanitize)
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: firstError });
      return;
    }

    const { email, password, name, phoneNumber, referralCode } = parsed.data;

    // 2. Cek apakah email udah dipake
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email sudah terdaftar. Silakan login.' });
      return;
    }

    // 3. Cek Kode Referral jika diisi
    let referredById: string | null = null;
    if (referralCode) {
      const parentUser = await prisma.user.findUnique({
        where: { referralCode: referralCode.toUpperCase() }
      });
      if (parentUser) {
        referredById = parentUser.id;
      } else {
        res.status(400).json({ error: 'Kode Referral tidak valid atau tidak ditemukan.' });
        return;
      }
    }

    // 4. Hash Password (bcrypt, 12 rounds — more secure than 10)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Generate Referral Code unik (3 huruf + 4 angka)
    const rawPrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const namePrefix = rawPrefix.padEnd(3, 'X');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newReferralCode = `${namePrefix}${randomNum}`;

    // 6. Save ke Database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        referralCode: newReferralCode,
        referredById,
      },
    });

    // 7. Return token langsung (auto-login after register)
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrasi sukses! Selamat datang.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    // Prisma unique constraint error
    if (error?.code === 'P2002') {
      res.status(400).json({ error: 'Email sudah terdaftar.' });
      return;
    }
    console.error('[Auth Error]', error);
    res.status(500).json({ error: 'Terjadi kesalahan sistem, silakan coba lagi.' });
  }
};

// ═══════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validasi input dengan Zod
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: firstError });
      return;
    }

    const { email, password } = parsed.data;

    // 2. Cari User — Generic error message (anti user enumeration)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    // 3. Cek Password (bcrypt timing-safe)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    // 4. Generate JWT Token (7 hari)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login sukses!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Error]', error);
    res.status(500).json({ error: 'Terjadi kesalahan sistem, silakan coba lagi.' });
  }
};
