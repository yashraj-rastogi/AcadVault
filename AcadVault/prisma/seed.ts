import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production database with essential data...');

  // Clear existing data
  await prisma.ticket.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.academicRecord.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('admin@123', 10);

  // Create default admin user
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@acadvault.edu',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });

  // Create department structure
  await prisma.department.createMany({
    data: [
      { name: 'Computer Science', code: 'CS', head: '' },
      { name: 'Electronics Engineering', code: 'EE', head: '' },
      { name: 'Mechanical Engineering', code: 'ME', head: '' },
      { name: 'Civil Engineering', code: 'CE', head: '' },
      { name: 'Electrical Engineering', code: 'EL', head: '' },
    ],
  });

  console.log('✅ Production seed complete! Created admin user and departments.');
  console.log('   Admin login: admin / admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
