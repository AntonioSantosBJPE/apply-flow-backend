import { PrismaClient } from '../../generated/prisma';

export async function seedDepartments(prisma: PrismaClient): Promise<void> {
  console.log('Seeding departments...');

  const departments = [
    {
      name: 'IT',
      description: 'Information Technology Department',
    },
    {
      name: 'HR',
      description: 'Human Resources Department',
    },
    {
      name: 'Finance',
      description: 'Finance Department',
    },
    {
      name: 'Marketing',
      description: 'Marketing Department',
    },
    {
      name: 'Operations',
      description: 'Operations Department',
    },
    {
      name: 'Sales',
      description: 'Sales Department',
    },
    {
      name: 'Legal',
      description: 'Legal Department',
    },
    {
      name: 'Executive',
      description: 'Executive Department',
    },
  ];

  // Use upsert to avoid duplicates
  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: department,
      create: department,
    });
  }

  console.log(`✅ ${departments.length} departments seeded`);
}
