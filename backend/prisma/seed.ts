import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Seeding Akademi Edukasi Forex Academy...');

  // ═══════════════════════════════════════
  // 1. ADMIN / MENTOR
  // ═══════════════════════════════════════
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@apexelite.com' },
    update: {},
    create: {
      email: 'admin@apexelite.com',
      name: 'Mentor Apex',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      vipValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
      referralCode: 'APEXMENTOR1',
    },
  });
  console.log('✅ Admin:', admin.email);

  // ═══════════════════════════════════════
  // 2. KURSUS FOREX — 4 PILAR EDUKASI
  // ═══════════════════════════════════════
  const courses = [
    // ── FUNDAMENTAL MAKROEKONOMI (3 kursus) ──────────
    {
      title: 'Non-Farm Payroll (NFP) & Dampaknya ke Gold',
      slug: 'nfp-dampak-gold',
      description: 'Pahami rilisan data NFP AS: apa itu, kapan rilisnya tiap bulan, dan gimana cara trader institusi memanfaatkan volatilitas NFP buat gerakin harga XAUUSD.',
      category: 'Fundamental',
      price: 0, isPremium: false, order: 1, lessonCount: 4,
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'fund-nfp-01',
    },
    {
      title: 'CPI, PPI & Inflasi: Membaca Arah Kebijakan The Fed',
      slug: 'cpi-ppi-inflasi-the-fed',
      description: 'Data CPI & PPI adalah petunjuk utama arah suku bunga The Fed. Pelajari cara baca rilis data inflasi dan dampaknya ke USD dan Gold secara real-time.',
      category: 'Fundamental',
      price: 0, isPremium: true, order: 2, lessonCount: 5,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'fund-cpi-02',
    },
    {
      title: 'FOMC Meeting & Interest Rate Decision',
      slug: 'fomc-interest-rate',
      description: 'Setiap kali FOMC meeting, market bisa terbang atau jatuh dalam hitungan detik. Pelajari cara antisipasi keputusan suku bunga dan statement dovish/hawkish dari Jerome Powell.',
      category: 'Fundamental',
      price: 0, isPremium: true, order: 3, lessonCount: 3,
      thumbnailUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'fund-fomc-03',
    },

    // ── TEKNIKAL & MARKET STRUCTURE (4 kursus) ──────────
    {
      title: 'Market Structure Shift (MSS) & Break of Structure',
      slug: 'market-structure-shift',
      description: 'Fondasi utama SMC: pahami bagaimana institusi besar menggeser struktur market dari bullish ke bearish (atau sebaliknya) dan cara kita entry bersama mereka.',
      category: 'Teknikal',
      price: 0, isPremium: false, order: 1, lessonCount: 6,
      thumbnailUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'tech-mss-01',
    },
    {
      title: 'Liquidity Concepts & Inducement',
      slug: 'liquidity-concepts-inducement',
      description: 'Belajar letak uang para retail trader (liquidity pool) dan bagaimana smart money memanipulasi mereka sebelum melakukan pergerakan sesungguhnya.',
      category: 'Teknikal',
      price: 50, isPremium: true, order: 2, lessonCount: 5,
      thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'tech-liq-02',
    },
    {
      title: 'Order Block & Fair Value Gap (FVG)',
      slug: 'order-block-fvg',
      description: 'Cara identifikasi Order Block institusi di timeframe besar, lalu refine di timeframe kecil pakai Fair Value Gap buat entry presisi tinggi.',
      category: 'Teknikal',
      price: 50, isPremium: true, order: 3, lessonCount: 7,
      thumbnailUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'tech-ob-03',
    },
    {
      title: 'Multi-Timeframe Analysis & Entry Model',
      slug: 'multi-timeframe-entry-model',
      description: 'Cara menggabungkan analisa dari HTF (Daily, H4) ke LTF (M15, M5) untuk mendapatkan entry model dengan Risk-Reward Ratio (RR) minimal 1:3.',
      category: 'Teknikal',
      price: 50, isPremium: true, order: 4, lessonCount: 4,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'tech-mtf-04',
    },

    // ── PSIKOLOGI TRADING (3 kursus) ──────────
    {
      title: 'Anti-FOMO: Mengendalikan Emosi Saat Trading',
      slug: 'anti-fomo-emosi-trading',
      description: 'FOMO (Fear of Missing Out) adalah pembunuh akun nomor 1. Pelajari teknik psikologis untuk tetap tenang dan disiplin saat market bergerak cepat.',
      category: 'Psikologi',
      price: 0, isPremium: false, order: 1, lessonCount: 4,
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'psy-fomo-01',
    },
    {
      title: 'Trading Journal: Cara Evaluasi Diri yang Benar',
      slug: 'trading-journal-evaluasi',
      description: 'Trader profesional punya jurnal. Belajar cara bikin trading journal yang efektif — catat entry, exit, emosi, dan screenshot chart buat evaluasi mingguan.',
      category: 'Psikologi',
      price: 0, isPremium: true, order: 2, lessonCount: 3,
      thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'psy-journal-02',
    },
    {
      title: 'Mindset Proses vs Mindset Profit',
      slug: 'mindset-proses-vs-profit',
      description: 'Mengapa fokus pada profit langsung justru bikin rugi? Pelajari cara mengalihkan mindset dari "berapa profit hari ini" ke "apakah aku mengikuti plan hari ini".',
      category: 'Psikologi',
      price: 0, isPremium: true, order: 3, lessonCount: 2,
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'psy-mindset-03',
    },

    // ── RISK & MONEY MANAGEMENT (3 kursus) ──────────
    {
      title: 'Position Sizing & Lot Calculator',
      slug: 'position-sizing-lot-calculator',
      description: 'Jangan asal pasang lot! Pelajari formula position sizing yang benar berdasarkan saldo akun, risk per trade (1-2%), dan jarak Stop Loss dalam pips.',
      category: 'Risk Management',
      price: 0, isPremium: false, order: 1, lessonCount: 3,
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'risk-pos-01',
    },
    {
      title: 'Drawdown Control & Recovery Plan',
      slug: 'drawdown-control-recovery',
      description: 'Apa yang harus dilakukan saat akun lu drawdown 10%, 20%, atau 30%? Pelajari strategi recovery yang realistis tanpa revenge trading.',
      category: 'Risk Management',
      price: 0, isPremium: true, order: 2, lessonCount: 4,
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'risk-dd-02',
    },
    {
      title: 'Risk-Reward Ratio & Win Rate: Matematika Trading',
      slug: 'risk-reward-win-rate-matematika',
      description: 'Lu gak perlu menang 80% trade. Dengan RR 1:3, win rate 35% aja udah profit. Pelajari matematika di balik trading yang sustainable.',
      category: 'Risk Management',
      price: 0, isPremium: true, order: 3, lessonCount: 3,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'risk-rr-03',
    },
  ];

  for (const course of courses) {
    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: { category: course.category, lessonCount: course.lessonCount },
      create: course,
    });
    console.log(`✅ [${course.category}] ${created.title}`);
  }

  // ═══════════════════════════════════════
  // 3. DAILY RESEARCH SAMPLES
  // ═══════════════════════════════════════
  await prisma.dailyResearch.createMany({
    data: [
      {
        title: 'XAUUSD Post-NFP Liquidity Sweep',
        content: 'Gold baru saja menyapu likuiditas high Asia dan masuk ke area Order Block Bearish 4H. Waspadai pergeseran struktur di timeframe 15m untuk peluang sell.',
        isPremium: true,
        authorId: admin.id,
      },
      {
        title: 'CPI Data Reaction & Mitigation',
        content: 'Harga menyentuh Daily FVG dengan sempurna setelah data CPI rilis. Saat ini sedang memitigasi sisa order.',
        isPremium: false,
        authorId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Daily Research created');

  console.log('\n🎉 Seeding complete! 13 Forex courses + 2 research posts ready.\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
