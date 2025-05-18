import { PrismaClient } from '../../generated/prisma';

export async function seedPositions(prisma: PrismaClient): Promise<void> {
  console.log('Seeding positions...');

  // Get department IDs
  const itDepartment = await prisma.department.findUnique({
    where: { name: 'IT' },
  });

  const hrDepartment = await prisma.department.findUnique({
    where: { name: 'HR' },
  });

  const financeDepartment = await prisma.department.findUnique({
    where: { name: 'Finance' },
  });

  const marketingDepartment = await prisma.department.findUnique({
    where: { name: 'Marketing' },
  });

  const operationsDepartment = await prisma.department.findUnique({
    where: { name: 'Operations' },
  });

  const salesDepartment = await prisma.department.findUnique({
    where: { name: 'Sales' },
  });

  const legalDepartment = await prisma.department.findUnique({
    where: { name: 'Legal' },
  });

  const executiveDepartment = await prisma.department.findUnique({
    where: { name: 'Executive' },
  });

  if (
    !itDepartment ||
    !hrDepartment ||
    !financeDepartment ||
    !marketingDepartment ||
    !operationsDepartment ||
    !salesDepartment ||
    !legalDepartment ||
    !executiveDepartment
  ) {
    console.error(
      '❌ Required departments not found. Please run the department seed first.',
    );
    return;
  }

  const positions = [
    // IT Department Positions
    {
      name: 'CTO',
      description: 'Chief Technology Officer',
      department_id: itDepartment.id,
    },
    {
      name: 'Software Engineer',
      description: 'Develops and maintains software applications',
      department_id: itDepartment.id,
    },
    {
      name: 'Network Administrator',
      description: 'Manages IT infrastructure and networks',
      department_id: itDepartment.id,
    },
    {
      name: 'IT Manager',
      description: 'Manages IT team and operations',
      department_id: itDepartment.id,
    },

    // HR Department Positions
    {
      name: 'HR Director',
      description: 'Head of Human Resources',
      department_id: hrDepartment.id,
    },
    {
      name: 'HR Manager',
      description: 'Manages HR operations',
      department_id: hrDepartment.id,
    },
    {
      name: 'Recruiter',
      description: 'Handles recruitment and hiring',
      department_id: hrDepartment.id,
    },

    // Finance Department Positions
    {
      name: 'CFO',
      description: 'Chief Financial Officer',
      department_id: financeDepartment.id,
    },
    {
      name: 'Finance Manager',
      description: 'Manages financial operations',
      department_id: financeDepartment.id,
    },
    {
      name: 'Accountant',
      description: 'Handles accounting tasks',
      department_id: financeDepartment.id,
    },

    // Marketing Department Positions
    {
      name: 'Marketing Director',
      description: 'Head of Marketing',
      department_id: marketingDepartment.id,
    },
    {
      name: 'Marketing Manager',
      description: 'Manages marketing campaigns',
      department_id: marketingDepartment.id,
    },
    {
      name: 'Content Writer',
      description: 'Creates marketing content',
      department_id: marketingDepartment.id,
    },

    // Operations Department Positions
    {
      name: 'Operations Director',
      description: 'Head of Operations',
      department_id: operationsDepartment.id,
    },
    {
      name: 'Operations Manager',
      description: 'Manages daily operations',
      department_id: operationsDepartment.id,
    },

    // Sales Department Positions
    {
      name: 'Sales Director',
      description: 'Head of Sales',
      department_id: salesDepartment.id,
    },
    {
      name: 'Sales Manager',
      description: 'Manages sales team',
      department_id: salesDepartment.id,
    },
    {
      name: 'Sales Representative',
      description: 'Handles client sales',
      department_id: salesDepartment.id,
    },

    // Legal Department Positions
    {
      name: 'Legal Counsel',
      description: 'Provides legal advice',
      department_id: legalDepartment.id,
    },
    {
      name: 'Legal Assistant',
      description: 'Assists with legal matters',
      department_id: legalDepartment.id,
    },

    // Executive Department Positions
    {
      name: 'CEO',
      description: 'Chief Executive Officer',
      department_id: executiveDepartment.id,
    },
    {
      name: 'COO',
      description: 'Chief Operating Officer',
      department_id: executiveDepartment.id,
    },
    {
      name: 'Executive Assistant',
      description: 'Assists executives',
      department_id: executiveDepartment.id,
    },
  ];

  // Use upsert to avoid duplicates (using a composite unique constraint)
  for (const position of positions) {
    try {
      await prisma.position.upsert({
        where: {
          name_department_id: {
            name: position.name,
            department_id: position.department_id,
          },
        },
        update: position,
        create: position,
      });
    } catch (error) {
      console.error(`Error creating position ${position.name}:`, error);
    }
  }

  console.log(`✅ ${positions.length} positions seeded`);
}
