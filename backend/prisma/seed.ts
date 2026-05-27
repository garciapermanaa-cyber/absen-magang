import 'dotenv/config';
import prisma from '../src/utils/prisma';

async function main() {
  const offices = [
    {
      name: 'Main Office',
      latitude: -6.200000,
      longitude: 106.816666,
      radius: 100,
    },
    {
      name: 'Branch Office',
      latitude: -6.300000,
      longitude: 106.916666,
      radius: 150,
    },
  ];

  for (const office of offices) {
    await prisma.office.upsert({
      where: { name: office.name },
      update: {},
      create: office,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });