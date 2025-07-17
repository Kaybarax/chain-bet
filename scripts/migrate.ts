#!/usr/bin/env node

/**
 * Database migration script using migrate-mongo
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

async function runMigration(command = 'up') {
  const configPath = path.join(__dirname, '..', 'db', 'migrate-mongo-config.js');
  
  try {
    console.log(`Running migration: ${command}`);
    
    const { stdout, stderr } = await execAsync(`npx migrate-mongo ${command} -f ${configPath}`, {
      cwd: path.join(__dirname, '..', 'db')
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`Migration ${command} completed successfully`);
  } catch (error) {
    console.error(`Migration failed:`, error);
    process.exit(1);
  }
}

async function checkMigrationStatus() {
  const configPath = path.join(__dirname, '..', 'db', 'migrate-mongo-config.js');
  
  try {
    const { stdout } = await execAsync(`npx migrate-mongo status -f ${configPath}`, {
      cwd: path.join(__dirname, '..', 'db')
    });
    
    console.log('Migration status:');
    console.log(stdout);
  } catch (error) {
    console.error('Failed to check migration status:', error);
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'up':
    runMigration('up');
    break;
  case 'down':
    runMigration('down');
    break;
  case 'status':
    checkMigrationStatus();
    break;
  case 'create':
    const migrationName = process.argv[3];
    if (!migrationName) {
      console.error('Please provide a migration name');
      process.exit(1);
    }
    runMigration(`create ${migrationName}`);
    break;
  default:
    console.log('Usage: node migrate.js [up|down|status|create <name>]');
    console.log('  up     - Run pending migrations');
    console.log('  down   - Rollback last migration');
    console.log('  status - Show migration status');
    console.log('  create - Create new migration file');
    process.exit(1);
}
