import { PrismaClient } from '../../generated/prisma';
import { seedUsers } from './users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log('📋 Seeding basic authentication data only');

  try {
    // Seed users for authentication testing
    await seedUsers(prisma);

    console.log('✅ Database seeding completed successfully!');
    console.log('🔐 Basic authentication system is ready for testing');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
