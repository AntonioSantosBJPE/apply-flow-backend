import { PrismaClient } from '../../generated/prisma';

export async function seedUserRoles(prisma: PrismaClient): Promise<void> {
  console.log('Seeding user roles...');

  // Get users
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  const ceoUser = await prisma.user.findUnique({
    where: { email: 'ceo@example.com' },
  });

  // Get roles
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  const managerRole = await prisma.role.findUnique({
    where: { name: 'manager' },
  });

  const employeeRole = await prisma.role.findUnique({
    where: { name: 'employee' },
  });

  if (!adminUser || !ceoUser || !adminRole || !managerRole || !employeeRole) {
    console.error(
      '❌ Required users or roles not found. Please run the users and roles seeds first.',
    );
    return;
  }

  const userRoles = [
    {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
    {
      user_id: ceoUser.id,
      role_id: managerRole.id,
    },
    {
      user_id: ceoUser.id,
      role_id: employeeRole.id,
    },
  ];

  // Use upsert with composite unique constraint
  for (const userRole of userRoles) {
    try {
      await prisma.userRole.upsert({
        where: {
          user_id_role_id: {
            user_id: userRole.user_id,
            role_id: userRole.role_id,
          },
        },
        update: userRole,
        create: userRole,
      });
    } catch (error) {
      console.error(
        `Error assigning role ${userRole.role_id} to user ${userRole.user_id}:`,
        error,
      );
    }
  }

  console.log(`✅ ${userRoles.length} user roles seeded`);
}
