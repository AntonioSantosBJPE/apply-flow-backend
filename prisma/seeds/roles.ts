import { PrismaClient } from '../../generated/prisma';

export async function seedRoles(prisma: PrismaClient): Promise<void> {
  console.log('Seeding roles...');

  const roles = [
    {
      name: 'admin',
      description: 'Administrator with full system access',
      priority: 100,
      is_default: false,
    },
    {
      name: 'manager',
      description: 'Department manager with elevated permissions',
      priority: 80,
      is_default: false,
    },
    {
      name: 'supervisor',
      description: 'Team supervisor with team management permissions',
      priority: 60,
      is_default: false,
    },
    {
      name: 'employee',
      description: 'Regular employee with basic permissions',
      priority: 40,
      is_default: true,
    },
    {
      name: 'guest',
      description: 'Guest user with limited view access',
      priority: 20,
      is_default: false,
    },
    {
      name: 'api_user',
      description: 'API integration user',
      priority: 30,
      is_default: false,
    },
    {
      name: 'auditor',
      description: 'Audit user with read-only access to logs and reports',
      priority: 50,
      is_default: false,
    },
  ];

  // Use upsert to avoid duplicates
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    });
  }

  console.log(`✅ ${roles.length} roles seeded`);
}
