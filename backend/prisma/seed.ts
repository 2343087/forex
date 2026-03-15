import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Bikin Admin/Mentor (VIP)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@apexelite.com' },
    update: {},
    create: {
      email: 'admin@apexelite.com',
      name: 'Mentor John',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      vipValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // VIP 10 Tahun
      referralCode: 'APEXMENTOR1',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // 2. Bikin Dummy Courses
  const courses = [
    {
      title: 'Market Structure Shift (MSS)',
      slug: 'market-structure-shift',
      description: 'Pahami bagaimana institusi besar menggeser struktur market dan cara kita entry bersama mereka.',
      price: 0, // Free
      isPremium: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'dummy-video-1',
    },
    {
      title: 'Liquidity Concepts & Inducement',
      slug: 'liquidity-concepts',
      description: 'Belajar letak uang para retail trader (liquidity) dan bagaimana smart money memanipulasinya.',
      price: 50.0,
      isPremium: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'dummy-video-2',
    },
    {
      title: 'Order Block Refinement',
      slug: 'order-block-refinement',
      description: 'Cara mempertajam (refine) Order Block di timeframe kecil untuk dapetin Risk-Reward Ratio (RR) raksasa.',
      price: 50.0,
      isPremium: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop',
      videoProviderId: 'dummy-video-3',
    }
  ];

  for (const course of courses) {
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
    console.log(`✅ Course created: ${createdCourse.title}`);
  }

  // 3. Bikin Dummy Daily Research buat ditampilin di Dashboard
  const research = await prisma.dailyResearch.create({
    data: {
      title: 'XAUUSD Post-NFP Liquidity Sweep',
      content: 'Gold baru saja menyapu likuiditas high Asia dan masuk ke area Order Block Bearish 4H. Waspadai pergeseran struktur di timeframe 15m untuk peluang sell.',
      isPremium: true,
      authorId: admin.id,
    }
  });
  
  const research2 = await prisma.dailyResearch.create({
    data: {
      title: 'CPI Data Reaction & Mitigation',
      content: 'Harga menyentuh Daily FVG dengan sempurna setelah data CPI rilis. Saat ini sedang memitigasi sisa order.',
      isPremium: false,
      authorId: admin.id,
    }
  });

  console.log('✅ Daily Research created');

  console.log('🎉 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
