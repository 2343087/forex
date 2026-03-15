import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating Role Accounts...');

  const roles: Role[] = [
    'FREE_MEMBER',
    'VIP_MEMBER',
    'ANALYST',
    'CS',
    'FINANCE'
  ];

  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const accounts = [];

  for (const role of roles) {
    const email = `${role.toLowerCase()}@apexelite.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {}, // Jika sudah ada, jangan diubah
      create: {
        email,
        name: `User ${role}`,
        password: hashedPassword,
        role: role,
        vipValidUntil: role === 'VIP_MEMBER' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : null,
      },
    });
    
    accounts.push({
      Role: role,
      Email: email,
      Password: password,
    });
    console.log(`✅ Created: ${email}`);
  }

  console.log('\n--- Kredensial Akun ---');
  console.table(accounts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
