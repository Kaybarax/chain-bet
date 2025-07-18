#!/usr/bin/env node

/**
 * Database seeding script for ChainBet
 */

import { MongoClient } from 'mongodb';
import { Match, Bet } from '../packages/types/database';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'chainbet';

const seedMatches: Match[] = [
  {
    matchId: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: new Date('2024-03-15T15:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_001_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_001_home', name: 'Home', odds: 2.10, status: 'active' },
          { selectionId: 'sel_001_draw', name: 'Draw', odds: 3.40, status: 'active' },
          { selectionId: 'sel_001_away', name: 'Away', odds: 3.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_001_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_001_btts_yes', name: 'YES', odds: 1.70, status: 'active' },
          { selectionId: 'sel_001_btts_no', name: 'NO', odds: 2.15, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_001_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_001_over', name: 'Over', odds: 1.85, status: 'active' },
          { selectionId: 'sel_001_under', name: 'Under', odds: 1.95, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_002',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    competition: 'La Liga',
    date: new Date('2024-03-16T20:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_002_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_002_home', name: 'Home', odds: 2.30, status: 'active' },
          { selectionId: 'sel_002_draw', name: 'Draw', odds: 3.20, status: 'active' },
          { selectionId: 'sel_002_away', name: 'Away', odds: 3.10, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_002_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_002_btts_yes', name: 'YES', odds: 1.65, status: 'active' },
          { selectionId: 'sel_002_btts_no', name: 'NO', odds: 2.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_002_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_002_over', name: 'Over', odds: 1.80, status: 'active' },
          { selectionId: 'sel_002_under', name: 'Under', odds: 2.00, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_003',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    competition: 'Bundesliga',
    date: new Date('2024-03-17T17:30:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_003_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_003_home', name: 'Home', odds: 1.90, status: 'active' },
          { selectionId: 'sel_003_draw', name: 'Draw', odds: 3.60, status: 'active' },
          { selectionId: 'sel_003_away', name: 'Away', odds: 4.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_003_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_003_btts_yes', name: 'YES', odds: 1.75, status: 'active' },
          { selectionId: 'sel_003_btts_no', name: 'NO', odds: 2.05, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_003_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_003_over', name: 'Over', odds: 1.90, status: 'active' },
          { selectionId: 'sel_003_under', name: 'Under', odds: 1.90, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_004',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    competition: 'Premier League',
    date: new Date('2024-03-18T14:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_004_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_004_home', name: 'Home', odds: 2.40, status: 'active' },
          { selectionId: 'sel_004_draw', name: 'Draw', odds: 3.30, status: 'active' },
          { selectionId: 'sel_004_away', name: 'Away', odds: 2.80, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_004_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_004_btts_yes', name: 'YES', odds: 1.60, status: 'active' },
          { selectionId: 'sel_004_btts_no', name: 'NO', odds: 2.30, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_004_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_004_over', name: 'Over', odds: 1.75, status: 'active' },
          { selectionId: 'sel_004_under', name: 'Under', odds: 2.05, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_005',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Olympique Marseille',
    competition: 'Ligue 1',
    date: new Date('2024-03-19T21:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_005_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_005_home', name: 'Home', odds: 1.70, status: 'active' },
          { selectionId: 'sel_005_draw', name: 'Draw', odds: 3.80, status: 'active' },
          { selectionId: 'sel_005_away', name: 'Away', odds: 4.50, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_005_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_005_btts_yes', name: 'YES', odds: 1.80, status: 'active' },
          { selectionId: 'sel_005_btts_no', name: 'NO', odds: 2.00, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_005_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_005_over', name: 'Over', odds: 1.95, status: 'active' },
          { selectionId: 'sel_005_under', name: 'Under', odds: 1.85, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const seedBets: Bet[] = [
  {
    betId: 'bet_001',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    matchId: 'match_001',
    marketId: 'market_001_1x2',
    selectionId: 'sel_001_home',
    stake: 0.1,
    potentialPayout: 0.21,
    odds: 2.10,
    status: 'pending',
    placedAt: new Date('2024-03-14T10:30:00Z'),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    betId: 'bet_002',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    matchId: 'match_002',
    marketId: 'market_002_btts',
    selectionId: 'sel_002_btts_yes',
    stake: 0.05,
    potentialPayout: 0.0825,
    odds: 1.65,
    status: 'won',
    placedAt: new Date('2024-03-13T14:20:00Z'),
    settledAt: new Date('2024-03-13T22:00:00Z'),
    txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
  }
];

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Clear existing collections
    await db.collection('matches').deleteMany({});
    await db.collection('bets').deleteMany({});
    console.log('Cleared existing data');
    
    // Insert seed data
    await db.collection('matches').insertMany(seedMatches);
    await db.collection('bets').insertMany(seedBets);
    
    console.log(`✅ Seeded ${seedMatches.length} matches`);
    console.log(`✅ Seeded ${seedBets.length} bets`);
    
    // Create indexes
    await db.collection('matches').createIndex({ matchId: 1 }, { unique: true });
    await db.collection('matches').createIndex({ homeTeam: 'text', awayTeam: 'text', competition: 'text' });
    await db.collection('bets').createIndex({ walletAddress: 1 });
    await db.collection('bets').createIndex({ betId: 1 }, { unique: true });
    
    console.log('✅ Created indexes');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database seeding completed');
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };

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
