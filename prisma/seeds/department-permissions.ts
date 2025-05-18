import { PrismaClient } from '../../generated/prisma';

export async function seedDepartmentPermissions(
  prisma: PrismaClient,
): Promise<void> {
  console.log('Seeding department permissions...');

  // Get IT department
  const itDepartment = await prisma.department.findUnique({
    where: { name: 'IT' },
  });

  // Get permissions related to resources
  const resourcePermissions = await prisma.permission.findMany({
    where: {
      resource: 'resource',
    },
  });

  if (!itDepartment || resourcePermissions.length === 0) {
    console.error('❌ Required departments or permissions not found.');
    return;
  }

  const departmentPermissions: {
    department_id: string;
    permission_id: string;
  }[] = [];

  // Give IT department all resource permissions
  resourcePermissions.forEach((permission) => {
    departmentPermissions.push({
      department_id: itDepartment.id,
      permission_id: permission.id,
    });
  });

  // Use upsert with composite unique constraint
  let successCount = 0;
  for (const departmentPermission of departmentPermissions) {
    try {
      await prisma.departmentPermission.upsert({
        where: {
          department_id_permission_id: {
            department_id: departmentPermission.department_id,
            permission_id: departmentPermission.permission_id,
          },
        },
        update: departmentPermission,
        create: departmentPermission,
      });
      successCount++;
    } catch (error) {
      console.error(
        `Error assigning permission ${departmentPermission.permission_id} to department ${departmentPermission.department_id}:`,
        error,
      );
    }
  }

  console.log(`✅ ${successCount} department permissions seeded`);
}
