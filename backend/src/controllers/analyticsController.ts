import { Request, Response } from 'express';
import { prisma } from '../config/db';

// GET /api/admin/analytics — Statistik lengkap buat admin
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Total Users by Role
    const totalUsers = await prisma.user.count();
    const totalVIP = await prisma.user.count({ where: { role: 'VIP_MEMBER' } });
    const totalFree = await prisma.user.count({ where: { role: 'FREE_MEMBER' } });

    // 2. Revenue (Total transaksi SUCCESS)
    const successfulTransactions = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true, createdAt: true }
    });
    
    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalTransactions = await prisma.transaction.count();
    const successCount = successfulTransactions.length;

    // 3. User Growth (Last 30 days - group by date)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const userGrowthMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split('T')[0];
      userGrowthMap[key] = 0;
    }
    recentUsers.forEach(u => {
      const key = u.createdAt.toISOString().split('T')[0];
      if (userGrowthMap[key] !== undefined) userGrowthMap[key]++;
    });

    const userGrowth = Object.entries(userGrowthMap).map(([date, count]) => ({
      date,
      count
    }));

    // 4. Revenue Growth (Last 30 days)
    const revenueGrowthMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split('T')[0];
      revenueGrowthMap[key] = 0;
    }
    successfulTransactions.forEach(t => {
      const key = t.createdAt.toISOString().split('T')[0];
      if (revenueGrowthMap[key] !== undefined) {
        revenueGrowthMap[key] += Number(t.amount);
      }
    });

    const revenueGrowth = Object.entries(revenueGrowthMap).map(([date, amount]) => ({
      date,
      amount
    }));

    // 5. Recent Transactions (10 terbaru)
    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    // 6. New Users Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await prisma.user.count({
      where: { createdAt: { gte: today } }
    });

    res.status(200).json({
      overview: {
        totalUsers,
        totalVIP,
        totalFree,
        totalRevenue,
        totalTransactions,
        successCount,
        newUsersToday
      },
      userGrowth,
      revenueGrowth,
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        orderId: t.orderId,
        userName: t.user.name,
        userEmail: t.user.email,
        amount: Number(t.amount),
        status: t.status,
        planType: (t as any).planType,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    console.error('[Analytics Error]', error);
    res.status(500).json({ error: 'Gagal memuat data analytics.' });
  }
};
