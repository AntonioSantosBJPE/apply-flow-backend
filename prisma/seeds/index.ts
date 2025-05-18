import { PrismaClient } from '../../generated/prisma';
import { seedPermissionGroups } from './permission-groups';
import { seedPermissions } from './permissions';
import { seedDepartments } from './departments';
import { seedPositions } from './positions';
import { seedRoles } from './roles';
import { seedUsers } from './users';
import { seedUserRoles } from './user-roles';
import { seedRolePermissions } from './role-permissions';
import { seedDepartmentPermissions } from './department-permissions';
import { seedPositionPermissions } from './position-permissions';
import { seedUserPermissions } from './user-permissions';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed basic tables first
    await seedPermissionGroups(prisma);
    await seedPermissions(prisma);
    await seedDepartments(prisma);
    await seedPositions(prisma);
    await seedRoles(prisma);

    // Seed users
    await seedUsers(prisma);

    // Seed relationships
    await seedUserRoles(prisma);
    await seedRolePermissions(prisma);
    await seedDepartmentPermissions(prisma);
    await seedPositionPermissions(prisma);
    await seedUserPermissions(prisma);

    console.log('✅ Database seeding completed successfully');
  } catch (error: unknown) {
    console.error(
      '❌ Database seeding failed:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
