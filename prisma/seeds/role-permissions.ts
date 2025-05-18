import { PrismaClient } from '../../generated/prisma';

export async function seedRolePermissions(prisma: PrismaClient): Promise<void> {
  console.log('Seeding role permissions...');

  // Get roles
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  const managerRole = await prisma.role.findUnique({
    where: { name: 'manager' },
  });

  const supervisorRole = await prisma.role.findUnique({
    where: { name: 'supervisor' },
  });

  const employeeRole = await prisma.role.findUnique({
    where: { name: 'employee' },
  });

  const guestRole = await prisma.role.findUnique({
    where: { name: 'guest' },
  });

  const apiUserRole = await prisma.role.findUnique({
    where: { name: 'api_user' },
  });

  const auditorRole = await prisma.role.findUnique({
    where: { name: 'auditor' },
  });

  if (
    !adminRole ||
    !managerRole ||
    !supervisorRole ||
    !employeeRole ||
    !guestRole ||
    !apiUserRole ||
    !auditorRole
  ) {
    console.error(
      '❌ Required roles not found. Please run the roles seed first.',
    );
    return;
  }

  // Get all permissions
  const permissions = await prisma.permission.findMany();

  if (permissions.length === 0) {
    console.error(
      '❌ No permissions found. Please run the permissions seed first.',
    );
    return;
  }

  // Create role permissions mapping
  const rolePermissionsMap = new Map<
    string,
    { role_id: string; permission_id: string }
  >();

  // Admin role has all permissions
  permissions.forEach((permission) => {
    rolePermissionsMap.set(`admin_${permission.id}`, {
      role_id: adminRole.id,
      permission_id: permission.id,
    });
  });

  // Get permission by action and resource
  const getPermission = (action: string, resource: string) => {
    return permissions.find(
      (p) => p.action === action && p.resource === resource,
    );
  };

  // Manager role permissions
  ['create', 'read', 'update', 'list'].forEach((action) => {
    ['user', 'department', 'position', 'resource', 'project'].forEach(
      (resource) => {
        const permission = getPermission(action, resource);
        if (permission) {
          rolePermissionsMap.set(`manager_${permission.id}`, {
            role_id: managerRole.id,
            permission_id: permission.id,
          });
        }
      },
    );
  });

  // Supervisor role permissions
  ['read', 'list'].forEach((action) => {
    ['user', 'department', 'position', 'resource', 'project'].forEach(
      (resource) => {
        const permission = getPermission(action, resource);
        if (permission) {
          rolePermissionsMap.set(`supervisor_${permission.id}`, {
            role_id: supervisorRole.id,
            permission_id: permission.id,
          });
        }
      },
    );
  });

  // Employee role permissions
  ['read', 'list'].forEach((action) => {
    ['resource', 'project'].forEach((resource) => {
      const permission = getPermission(action, resource);
      if (permission) {
        rolePermissionsMap.set(`employee_${permission.id}`, {
          role_id: employeeRole.id,
          permission_id: permission.id,
        });
      }
    });
  });

  // Guest role permissions
  ['read'].forEach((action) => {
    ['resource'].forEach((resource) => {
      const permission = getPermission(action, resource);
      if (permission) {
        rolePermissionsMap.set(`guest_${permission.id}`, {
          role_id: guestRole.id,
          permission_id: permission.id,
        });
      }
    });
  });

  // API user role permissions (depends on use case)
  ['read', 'create', 'update'].forEach((action) => {
    ['resource', 'project'].forEach((resource) => {
      const permission = getPermission(action, resource);
      if (permission) {
        rolePermissionsMap.set(`api_user_${permission.id}`, {
          role_id: apiUserRole.id,
          permission_id: permission.id,
        });
      }
    });
  });

  // Auditor role permissions
  ['read', 'list'].forEach((action) => {
    ['audit'].forEach((resource) => {
      const permission = getPermission(action, resource);
      if (permission) {
        rolePermissionsMap.set(`auditor_${permission.id}`, {
          role_id: auditorRole.id,
          permission_id: permission.id,
        });
      }
    });
  });

  // Convert Map to Array
  const rolePermissions: Array<{ role_id: string; permission_id: string }> =
    Array.from(rolePermissionsMap.values());

  // Use upsert with composite unique constraint
  let successCount = 0;
  for (const rolePermission of rolePermissions) {
    try {
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: rolePermission.role_id,
            permission_id: rolePermission.permission_id,
          },
        },
        update: rolePermission,
        create: rolePermission,
      });
      successCount++;
    } catch (error) {
      console.error(
        `Error assigning permission ${rolePermission.permission_id} to role ${rolePermission.role_id}:`,
        error,
      );
    }
  }

  console.log(`✅ ${successCount} role permissions seeded`);
}
