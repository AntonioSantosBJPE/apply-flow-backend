import { PrismaClient } from '../../generated/prisma';

export async function seedPositionPermissions(
  prisma: PrismaClient,
): Promise<void> {
  console.log('Seeding position permissions...');

  // Get CTO position
  const ctoPosition = await prisma.position.findFirst({
    where: { name: 'CTO' },
  });

  // Get CEO position
  const ceoPosition = await prisma.position.findFirst({
    where: { name: 'CEO' },
  });

  // Get permissions related to users
  const userPermissions = await prisma.permission.findMany({
    where: {
      resource: 'user',
    },
  });

  if (!ctoPosition || !ceoPosition || userPermissions.length === 0) {
    console.error('❌ Required positions or permissions not found.');
    return;
  }

  const positionPermissions: {
    position_id: string;
    permission_id: string;
  }[] = [];

  // Give CTO all user permissions
  userPermissions.forEach((permission) => {
    positionPermissions.push({
      position_id: ctoPosition.id,
      permission_id: permission.id,
    });
  });

  // Give CEO all user permissions
  userPermissions.forEach((permission) => {
    positionPermissions.push({
      position_id: ceoPosition.id,
      permission_id: permission.id,
    });
  });

  // Use upsert with composite unique constraint
  let successCount = 0;
  for (const positionPermission of positionPermissions) {
    try {
      await prisma.positionPermission.upsert({
        where: {
          position_id_permission_id: {
            position_id: positionPermission.position_id,
            permission_id: positionPermission.permission_id,
          },
        },
        update: positionPermission,
        create: positionPermission,
      });
      successCount++;
    } catch (error) {
      console.error(
        `Error assigning permission ${positionPermission.permission_id} to position ${positionPermission.position_id}:`,
        error,
      );
    }
  }

  console.log(`✅ ${successCount} position permissions seeded`);
}
