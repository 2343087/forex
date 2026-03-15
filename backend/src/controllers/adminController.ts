import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { z } from 'zod';

// Zod schemas for admin input validation
const researchSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter.').max(200).trim(),
  content: z.string().min(10, 'Konten minimal 10 karakter.').max(50000),
  isPremium: z.boolean().optional().default(true),
  imageUrl: z.string().url().optional().nullable(),
});

// Strip basic XSS from title (content uses rich text so we allow HTML)
const sanitizeTitle = (str: string) => str.replace(/<[^>]*>/g, '').trim();

export const createDailyResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = researchSchema.safeParse(req.body);
    if (!parsed.success) {
      const errMsg = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: errMsg });
      return;
    }

    const { title, content, isPremium, imageUrl } = parsed.data;
    const authorId = req.user?.userId;

    if (!authorId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newResearch = await prisma.dailyResearch.create({
      data: {
        title,
        content,
        isPremium: isPremium ?? true,
        imageUrl,
        authorId,
      }
    });

    res.status(201).json({
      message: 'Analisa Market berhasil dipublish!',
      research: newResearch
    });

  } catch (error) {
    console.error('[Admin Error]', error);
    res.status(500).json({ error: 'Gagal mempublish Daily Research.' });
  }
};

export const getAllDailyResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const research = await prisma.dailyResearch.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        isPremium: true,
        createdAt: true,
      }
    });
    res.status(200).json(research);
  } catch (error) {
    console.error('[Admin Error]', error);
    res.status(500).json({ error: 'Gagal mengambil data research.' });
  }
};

export const deleteDailyResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const researchId = req.params.id as string;
    await prisma.dailyResearch.delete({ where: { id: researchId } });
    res.status(200).json({ message: 'Research post berhasil dihapus.' });
  } catch (error) {
    console.error('[Admin Delete Error]', error);
    res.status(500).json({ error: 'Gagal ngehapus research post.' });
  }
};

export const getDailyResearchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const researchId = req.params.id as string;
    const research = await prisma.dailyResearch.findUnique({ where: { id: researchId } });
    if (!research) {
      res.status(404).json({ error: 'Postingan analisa ga ketemu.' });
      return;
    }
    res.status(200).json(research);
  } catch (error) {
    console.error('[Admin Get Error]', error);
    res.status(500).json({ error: 'Gagal ngambil data analisa.' });
  }
};

export const updateDailyResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const researchId = req.params.id as string;
    const parsed = researchSchema.safeParse(req.body);
    if (!parsed.success) {
      const errMsg = (() => { try { return JSON.parse(parsed.error.message)[0]?.message; } catch { return 'Input tidak valid.'; } })();
      res.status(400).json({ error: errMsg });
      return;
    }

    const { title, content, isPremium, imageUrl } = parsed.data;

    const updatedResearch = await prisma.dailyResearch.update({
      where: { id: researchId },
      data: {
        title: sanitizeTitle(title), 
        content, 
        isPremium: isPremium ?? true, 
        imageUrl
      }
    });

    res.status(200).json({ message: 'Analisa sukses di-update!', research: updatedResearch });
  } catch (error) {
    console.error('[Admin Update Error]', error);
    res.status(500).json({ error: 'Gagal update analisa.' });
  }
};
