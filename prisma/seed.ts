import 'dotenv/config';
import prisma from '../src/utils/prisma';
import bcrypt from 'bcrypt';

async function main() {
  // 1. Seed Office
  const offices = [
    {
      name: 'Newus Technology',
      latitude: -5.4259694,
      longitude: 105.2722250,
      radius: 100,
    },
  ];

  for (const office of offices) {
    await prisma.office.upsert({
      where: { name: office.name },
      update: {},
      create: office,
    });
  }

  // 2. Seed Default Admin
  const adminEmail = 'admin@newus.id';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed data created successfully');
  console.log('Admin Login: admin@newus.id / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });