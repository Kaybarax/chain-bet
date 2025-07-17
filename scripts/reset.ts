#!/usr/bin/env node

/**
 * Database reset script - drops all collections and re-runs migrations and seeding
 */

const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

async function resetMongoDB() {
  const client = new MongoClient(
    process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin'
  );

  try {
    await client.connect();
    const db = client.db('chainbet');

    console.log('Dropping MongoDB collections...');

    // Get all collections
    const collections = await db.listCollections().toArray();
    
    // Drop all collections except system collections
    for (const collection of collections) {
      if (!collection.name.startsWith('system.')) {
        await db.collection(collection.name).drop();
        console.log(`Dropped collection: ${collection.name}`);
      }
    }

    console.log('MongoDB reset completed');
  } catch (error) {
    console.error('Error resetting MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function resetElasticsearch() {
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  });

  try {
    console.log('Resetting Elasticsearch indexes...');

    // Delete all indexes starting with todos_ or projects_
    const { body: indices } = await client.cat.indices({ format: 'json' });
    
    for (const index of indices) {
      if (index.index.startsWith('todos_') || index.index.startsWith('projects_')) {
        await client.indices.delete({ index: index.index });
        console.log(`Deleted index: ${index.index}`);
      }
    }

    console.log('Elasticsearch reset completed');
  } catch (error) {
    console.error('Error resetting Elasticsearch:', error);
    throw error;
  }
}

async function runMigrations() {
  const configPath = path.join(__dirname, '..', 'db', 'migrate-mongo-config.js');
  
  try {
    console.log('Running migrations...');
    
    const { stdout, stderr } = await execAsync(`npx migrate-mongo up -f ${configPath}`, {
      cwd: path.join(__dirname, '..', 'db')
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('Migrations completed');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function runSeeding() {
  try {
    console.log('Running seeding...');
    
    const { runSeeding } = require('./seed');
    await runSeeding();
    
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    
    // Reset MongoDB
    await resetMongoDB();
    
    // Reset Elasticsearch
    await resetElasticsearch();
    
    // Run migrations
    await runMigrations();
    
    // Run seeding
    await runSeeding();
    
    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'mongo':
    resetMongoDB();
    break;
  case 'elasticsearch':
    resetElasticsearch();
    break;
  case 'all':
  default:
    resetDatabase();
    break;
}

module.exports = { resetDatabase, resetMongoDB, resetElasticsearch };
