#!/usr/bin/env node

/**
 * Database seeding script
 */

const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');
const { seedDatabase } = require('../db/seeds/seed');

async function setupElasticsearch() {
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  });

  try {
    console.log('Setting up Elasticsearch indexes...');

    // Check if index exists
    const indexExists = await client.indices.exists({ index: 'todos_v1' });
    
    if (!indexExists) {
      // Create todos index with mapping
      await client.indices.create({
        index: 'todos_v1',
        body: {
          mappings: {
            properties: {
              title: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: {
                    type: 'keyword'
                  }
                }
              },
              description: {
                type: 'text',
                analyzer: 'standard'
              },
              completed: {
                type: 'boolean'
              },
              priority: {
                type: 'keyword'
              },
              category: {
                type: 'keyword'
              },
              subcategory: {
                type: 'keyword'
              },
              tags: {
                type: 'keyword'
              },
              dueDate: {
                type: 'date'
              },
              createdAt: {
                type: 'date'
              },
              updatedAt: {
                type: 'date'
              }
            }
          },
          settings: {
            analysis: {
              analyzer: {
                todo_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'stemmer']
                }
              },
              filter: {
                stemmer: {
                  type: 'stemmer',
                  language: 'english'
                }
              }
            }
          }
        }
      });

      console.log('Created todos_v1 index');
    }

    // Create alias for current version
    const aliasExists = await client.indices.existsAlias({ name: 'todos_latest' });
    
    if (!aliasExists) {
      await client.indices.putAlias({
        index: 'todos_v1',
        name: 'todos_latest'
      });
      console.log('Created todos_latest alias');
    }

    // Create projects index
    const projectsIndexExists = await client.indices.exists({ index: 'projects_v1' });
    
    if (!projectsIndexExists) {
      await client.indices.create({
        index: 'projects_v1',
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: {
                    type: 'keyword'
                  }
                }
              },
              description: {
                type: 'text',
                analyzer: 'standard'
              },
              status: {
                type: 'keyword'
              },
              createdAt: {
                type: 'date'
              },
              updatedAt: {
                type: 'date'
              }
            }
          }
        }
      });

      await client.indices.putAlias({
        index: 'projects_v1',
        name: 'projects_latest'
      });

      console.log('Created projects indexes and aliases');
    }

  } catch (error) {
    console.error('Error setting up Elasticsearch:', error);
    throw error;
  }
}

async function syncToElasticsearch() {
  const mongoClient = new MongoClient(
    process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin'
  );

  const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  });

  try {
    await mongoClient.connect();
    const db = mongoClient.db('chainbet');

    console.log('Syncing data to Elasticsearch...');

    // Sync todos
    const todos = await db.collection('todos').find({}).toArray();
    
    if (todos.length > 0) {
      const body = todos.flatMap(todo => [
        { index: { _index: 'todos_latest', _id: todo._id.toString() } },
        {
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority,
          category: todo.category,
          subcategory: todo.subcategory,
          tags: todo.tags,
          dueDate: todo.dueDate,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt
        }
      ]);

      await esClient.bulk({ body });
      console.log(`Synced ${todos.length} todos to Elasticsearch`);
    }

    // Sync projects
    const projects = await db.collection('projects').find({}).toArray();
    
    if (projects.length > 0) {
      const body = projects.flatMap(project => [
        { index: { _index: 'projects_latest', _id: project._id.toString() } },
        {
          name: project.name,
          description: project.description,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        }
      ]);

      await esClient.bulk({ body });
      console.log(`Synced ${projects.length} projects to Elasticsearch`);
    }

  } catch (error) {
    console.error('Error syncing to Elasticsearch:', error);
    throw error;
  } finally {
    await mongoClient.close();
  }
}

async function runSeeding() {
  try {
    console.log('Starting database seeding process...');
    
    // Run MongoDB seeding
    await seedDatabase();
    
    // Setup Elasticsearch
    await setupElasticsearch();
    
    // Sync data to Elasticsearch
    await syncToElasticsearch();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  runSeeding();
}

module.exports = { runSeeding, setupElasticsearch, syncToElasticsearch };
