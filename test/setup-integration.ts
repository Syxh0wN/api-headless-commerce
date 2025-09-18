import { execSync } from 'child_process';

beforeAll(async () => {
  console.log('Setting up integration tests...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated');
  } catch (error) {
    console.warn('Failed to generate Prisma client:', error.message);
  }
});

afterAll(async () => {
  console.log('Cleaning up integration tests...');
});
