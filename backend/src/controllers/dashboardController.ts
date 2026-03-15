import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // 1. Ambil 3 Analisa Market Terbaru
    const latestResearch = await prisma.dailyResearch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        content: true,
        isPremium: true,
        createdAt: true,
      }
    });

    // 2. Hitung statistik Modul (Course)
    const totalCourses = await prisma.course.count();
    let userActiveModules = 0;

    if (userId) {
      userActiveModules = await prisma.courseAccess.count({
        where: { userId }
      });
    }

    res.status(200).json({
      stats: {
        winRate: "78%", 
        winRateTrend: "Global Komunitas",
        activeModules: `${userActiveModules}/${totalCourses}`,
        liveSessions: "2", // Dummy data
      },
      latestResearch,
    });

  } catch (error) {
    console.error('[Dashboard Error]', error);
    res.status(500).json({ error: 'Gagal muat data dashboard.' });
  }
};
