import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const users = [
  {
    email: 'admin@applyflow.com',
    password_hash: '', // Will be set below
    first_name: 'Admin',
    last_name: 'User',
    is_active: true,
    is_email_verified: true,
    last_login: new Date(),
  },
  {
    email: 'test@applyflow.com',
    password_hash: '', // Will be set below
    first_name: 'Test',
    last_name: 'User',
    is_active: true,
    is_email_verified: true,
    last_login: new Date(),
  },
  {
    email: 'demo@applyflow.com',
    password_hash: '', // Will be set below
    first_name: 'Demo',
    last_name: 'User',
    is_active: true,
    is_email_verified: false,
    last_login: null,
  },
];

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...');

  const saltRounds = 10;
  const defaultPassword = 'password123';

  // Hash the password
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  // Set the password hash for all users
  const usersWithPasswords = users.map((user) => ({
    ...user,
    password_hash: passwordHash,
  }));

  for (const user of usersWithPasswords) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Users seeded successfully');
  console.log('ℹ️  Default password for all users: password123');
  console.log(
    '📧 Test emails: admin@applyflow.com, test@applyflow.com, demo@applyflow.com',
  );
}
