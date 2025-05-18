import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  console.log('Seeding users...');

  // Get IT department for admin
  const itDepartment = await prisma.department.findUnique({
    where: { name: 'IT' },
  });

  // Get Executive department for CEO
  const executiveDepartment = await prisma.department.findUnique({
    where: { name: 'Executive' },
  });

  // Get positions
  const ctoPosition = await prisma.position.findFirst({
    where: {
      name: 'CTO',
      department_id: itDepartment?.id,
    },
  });

  const ceoPosition = await prisma.position.findFirst({
    where: {
      name: 'CEO',
      department_id: executiveDepartment?.id,
    },
  });

  if (!itDepartment || !executiveDepartment || !ctoPosition || !ceoPosition) {
    console.error(
      '❌ Required departments or positions not found. Please run the departments and positions seeds first.',
    );
    return;
  }

  // Hash passwords
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  const testPasswordHash = await bcrypt.hash('test123', saltRounds);

  const users = [
    {
      email: 'admin@example.com',
      password_hash: adminPasswordHash,
      first_name: 'Admin',
      last_name: 'User',
      department_id: itDepartment.id,
      position_id: ctoPosition.id,
      is_active: true,
      is_email_verified: true,
      last_login: new Date(),
    },
    {
      email: 'ceo@example.com',
      password_hash: testPasswordHash,
      first_name: 'John',
      last_name: 'Doe',
      department_id: executiveDepartment.id,
      position_id: ceoPosition.id,
      is_active: true,
      is_email_verified: true,
      last_login: new Date(),
    },
  ];

  // Use upsert to avoid duplicates
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log(`✅ ${users.length} users seeded`);
}
