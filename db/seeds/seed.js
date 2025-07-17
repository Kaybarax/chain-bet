/**
 * Database seeding script for TODO application
 */

const { MongoClient } = require('mongodb');

const seedData = {
  users: [
    {
      email: 'admin@chainbet.com',
      name: 'System Admin',
      role: 'admin',
      preferences: {
        theme: 'dark',
        notifications: true,
        timezone: 'UTC'
      },
      schemaVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'user',
      preferences: {
        theme: 'light',
        notifications: true,
        timezone: 'America/New_York'
      },
      schemaVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'user',
      preferences: {
        theme: 'auto',
        notifications: false,
        timezone: 'Europe/London'
      },
      schemaVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  projects: [
    {
      name: 'ChainBet Development',
      description: 'Main development project for the ChainBet platform',
      status: 'active',
      schemaVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Marketing Campaign',
      description: 'Q1 marketing campaign planning and execution',
      status: 'active',
      schemaVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Infrastructure Migration',
      description: 'Migration to new cloud infrastructure',
      status: 'completed',
      schemaVersion: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  ],

  todos: [
    {
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      completed: false,
      priority: 'high',
      category: 'work',
      subcategory: 'devops',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ['devops', 'automation', 'github'],
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation using OpenAPI/Swagger',
      completed: false,
      priority: 'medium',
      category: 'work',
      subcategory: 'documentation',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      tags: ['documentation', 'api', 'swagger'],
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Implement User Authentication',
      description: 'Add JWT-based authentication system with refresh tokens',
      completed: true,
      priority: 'high',
      category: 'work',
      subcategory: 'security',
      tags: ['auth', 'security', 'jwt'],
      schemaVersion: 2,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date()
    },
    {
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, and vegetables',
      completed: false,
      priority: 'medium',
      category: 'personal',
      subcategory: 'shopping',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      tags: ['shopping', 'food'],
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Schedule dentist appointment',
      description: 'Annual check-up and cleaning',
      completed: false,
      priority: 'low',
      category: 'health',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      tags: ['health', 'appointment'],
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Complete React course',
      description: 'Finish the advanced React patterns course on Udemy',
      completed: false,
      priority: 'medium',
      category: 'education',
      subcategory: 'programming',
      tags: ['learning', 'react', 'javascript'],
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

async function seedDatabase() {
  const client = new MongoClient(
    process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin'
  );

  try {
    await client.connect();
    const db = client.db('chainbet');

    console.log('Starting database seeding...');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('projects').deleteMany({});
    await db.collection('todos').deleteMany({});

    // Insert users
    const userInsertResult = await db.collection('users').insertMany(seedData.users);
    console.log(`Inserted ${userInsertResult.insertedCount} users`);

    // Insert projects and assign owners
    const projectsWithOwners = seedData.projects.map((project, index) => ({
      ...project,
      ownerId: userInsertResult.insertedIds[index % userInsertResult.insertedCount],
      members: [userInsertResult.insertedIds[index % userInsertResult.insertedCount]]
    }));

    const projectInsertResult = await db.collection('projects').insertMany(projectsWithOwners);
    console.log(`Inserted ${projectInsertResult.insertedCount} projects`);

    // Insert todos and assign to users and projects
    const todosWithAssignments = seedData.todos.map((todo, index) => ({
      ...todo,
      assignedTo: userInsertResult.insertedIds[index % userInsertResult.insertedCount],
      projectId: index < 3 ? projectInsertResult.insertedIds[0] : null // First 3 todos assigned to first project
    }));

    const todoInsertResult = await db.collection('todos').insertMany(todosWithAssignments);
    console.log(`Inserted ${todoInsertResult.insertedCount} todos`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedData };
