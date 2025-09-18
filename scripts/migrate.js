const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

async function checkDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('Starting database setup...');
  
  await checkDatabaseConnection();
  await runMigrations();
  
  console.log('Database setup completed');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations, checkDatabaseConnection };
