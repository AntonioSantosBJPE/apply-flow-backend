import { PrismaClient } from '../../generated/prisma';

export async function seedUserPermissions(prisma: PrismaClient): Promise<void> {
  console.log('Seeding user permissions...');

  // Get admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  // Get CEO user
  const ceoUser = await prisma.user.findUnique({
    where: { email: 'ceo@example.com' },
  });

  // Get specific permissions to assign directly
  const auditListPermission = await prisma.permission.findFirst({
    where: {
      action: 'list',
      resource: 'audit',
    },
  });

  const deleteUserPermission = await prisma.permission.findFirst({
    where: {
      action: 'delete',
      resource: 'user',
    },
  });

  if (!adminUser || !ceoUser || !auditListPermission || !deleteUserPermission) {
    console.error('❌ Required users or permissions not found.');
    return;
  }

  // Create specific user permissions
  const userPermissions = [
    // Admin has explicit access to audit logs
    {
      user_id: adminUser.id,
      permission_id: auditListPermission.id,
      is_allowed: true,
    },
    // CEO has explicit access to delete users
    {
      user_id: ceoUser.id,
      permission_id: deleteUserPermission.id,
      is_allowed: true,
    },
  ];

  // Use upsert with composite unique constraint
  let successCount = 0;
  for (const userPermission of userPermissions) {
    try {
      await prisma.userPermission.upsert({
        where: {
          user_id_permission_id: {
            user_id: userPermission.user_id,
            permission_id: userPermission.permission_id,
          },
        },
        update: userPermission,
        create: userPermission,
      });
      successCount++;
    } catch (error) {
      console.error(
        `Error assigning permission ${userPermission.permission_id} to user ${userPermission.user_id}:`,
        error,
      );
    }
  }

  console.log(`✅ ${successCount} user permissions seeded`);
}
