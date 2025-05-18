import { PrismaClient } from '../../generated/prisma';

export async function seedPermissionGroups(
  prisma: PrismaClient,
): Promise<void> {
  console.log('Seeding permission groups...');

  const permissionGroups = [
    {
      name: 'User Management',
      description: 'Permissions related to user management',
    },
    {
      name: 'Role Management',
      description: 'Permissions related to role management',
    },
    {
      name: 'Permission Management',
      description: 'Permissions related to permission management',
    },
    {
      name: 'Department Management',
      description: 'Permissions related to department management',
    },
    {
      name: 'Position Management',
      description: 'Permissions related to position management',
    },
    {
      name: 'Resource Management',
      description: 'Permissions related to resource management',
    },
    {
      name: 'Project Management',
      description: 'Permissions related to project management',
    },
    {
      name: 'Audit Management',
      description: 'Permissions related to audit logs',
    },
  ];

  // Use upsert to avoid duplicates
  for (const group of permissionGroups) {
    await prisma.permissionGroup.upsert({
      where: { name: group.name },
      update: group,
      create: group,
    });
  }

  console.log(`✅ ${permissionGroups.length} permission groups seeded`);
}
