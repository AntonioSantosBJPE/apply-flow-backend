import { PrismaClient } from '../../generated/prisma';

export async function seedPermissions(prisma: PrismaClient): Promise<void> {
  console.log('Seeding permissions...');

  // Get permission group IDs
  const userManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'User Management' },
  });

  const roleManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Role Management' },
  });

  const permissionManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Permission Management' },
  });

  const departmentManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Department Management' },
  });

  const positionManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Position Management' },
  });

  const resourceManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Resource Management' },
  });

  const projectManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Project Management' },
  });

  const auditManagementGroup = await prisma.permissionGroup.findUnique({
    where: { name: 'Audit Management' },
  });

  // Define permissions
  const permissionsData = [
    // User Management permissions
    {
      action: 'create',
      resource: 'user',
      description: 'Create a new user',
      is_route: true,
      group_id: userManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'user',
      description: 'Read user information',
      is_route: true,
      group_id: userManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'user',
      description: 'Update user information',
      is_route: true,
      group_id: userManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'user',
      description: 'Delete a user',
      is_route: true,
      group_id: userManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'user',
      description: 'List all users',
      is_route: true,
      group_id: userManagementGroup?.id,
    },

    // Role Management permissions
    {
      action: 'create',
      resource: 'role',
      description: 'Create a new role',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'role',
      description: 'Read role information',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'role',
      description: 'Update role information',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'role',
      description: 'Delete a role',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'role',
      description: 'List all roles',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'assign',
      resource: 'role',
      description: 'Assign a role to a user',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },
    {
      action: 'revoke',
      resource: 'role',
      description: 'Revoke a role from a user',
      is_route: true,
      group_id: roleManagementGroup?.id,
    },

    // Permission Management permissions
    {
      action: 'create',
      resource: 'permission',
      description: 'Create a new permission',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'permission',
      description: 'Read permission information',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'permission',
      description: 'Update permission information',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'permission',
      description: 'Delete a permission',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'permission',
      description: 'List all permissions',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'assign',
      resource: 'permission',
      description: 'Assign a permission',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },
    {
      action: 'revoke',
      resource: 'permission',
      description: 'Revoke a permission',
      is_route: true,
      group_id: permissionManagementGroup?.id,
    },

    // Department Management permissions
    {
      action: 'create',
      resource: 'department',
      description: 'Create a new department',
      is_route: true,
      group_id: departmentManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'department',
      description: 'Read department information',
      is_route: true,
      group_id: departmentManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'department',
      description: 'Update department information',
      is_route: true,
      group_id: departmentManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'department',
      description: 'Delete a department',
      is_route: true,
      group_id: departmentManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'department',
      description: 'List all departments',
      is_route: true,
      group_id: departmentManagementGroup?.id,
    },

    // Position Management permissions
    {
      action: 'create',
      resource: 'position',
      description: 'Create a new position',
      is_route: true,
      group_id: positionManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'position',
      description: 'Read position information',
      is_route: true,
      group_id: positionManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'position',
      description: 'Update position information',
      is_route: true,
      group_id: positionManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'position',
      description: 'Delete a position',
      is_route: true,
      group_id: positionManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'position',
      description: 'List all positions',
      is_route: true,
      group_id: positionManagementGroup?.id,
    },

    // Resource Management permissions
    {
      action: 'create',
      resource: 'resource',
      description: 'Create a new resource',
      is_route: true,
      group_id: resourceManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'resource',
      description: 'Read resource information',
      is_route: true,
      group_id: resourceManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'resource',
      description: 'Update resource information',
      is_route: true,
      group_id: resourceManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'resource',
      description: 'Delete a resource',
      is_route: true,
      group_id: resourceManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'resource',
      description: 'List all resources',
      is_route: true,
      group_id: resourceManagementGroup?.id,
    },

    // Project Management permissions
    {
      action: 'create',
      resource: 'project',
      description: 'Create a new project',
      is_route: true,
      group_id: projectManagementGroup?.id,
    },
    {
      action: 'read',
      resource: 'project',
      description: 'Read project information',
      is_route: true,
      group_id: projectManagementGroup?.id,
    },
    {
      action: 'update',
      resource: 'project',
      description: 'Update project information',
      is_route: true,
      group_id: projectManagementGroup?.id,
    },
    {
      action: 'delete',
      resource: 'project',
      description: 'Delete a project',
      is_route: true,
      group_id: projectManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'project',
      description: 'List all projects',
      is_route: true,
      group_id: projectManagementGroup?.id,
    },

    // Audit Management permissions
    {
      action: 'read',
      resource: 'audit',
      description: 'Read audit logs',
      is_route: true,
      group_id: auditManagementGroup?.id,
    },
    {
      action: 'list',
      resource: 'audit',
      description: 'List audit logs',
      is_route: true,
      group_id: auditManagementGroup?.id,
    },
  ];

  // Use upsert to avoid duplicates
  for (const permission of permissionsData) {
    await prisma.permission.upsert({
      where: {
        action_resource: {
          action: permission.action,
          resource: permission.resource,
        },
      },
      update: permission,
      create: permission,
    });
  }

  console.log(`✅ ${permissionsData.length} permissions seeded`);
}
