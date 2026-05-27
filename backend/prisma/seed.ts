import 'dotenv/config';
import prisma from '../src/utils/prisma';

async function main() {
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