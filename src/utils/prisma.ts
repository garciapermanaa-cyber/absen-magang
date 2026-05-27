import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing from environment variables!');
}

const prisma = new PrismaClient();

export default prisma;
