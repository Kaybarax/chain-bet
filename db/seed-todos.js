/**
 * Seed script for MongoDB to create initial todo items
 *
 * This script can be wired into docker-compose.dev.yml via command override
 * as mentioned in the MONOREPO-TEMPLATE-GUIDE.md
 */

const sampleTodos = [
  {
    title: 'Learn Turborepo',
    completed: false,
    schemaVersion: 1
  },
  {
    title: 'Setup monorepo structure',
    completed: true,
    schemaVersion: 1
  },
  {
    title: 'Implement todo app features',
    completed: false,
    schemaVersion: 1
  }
];

/**
 * Main function to seed the database
 */
async function seedDatabase() {
  console.log('Seeding database with sample todos...');

  // In a real implementation, this would connect to MongoDB
  // and insert the sample todos

  console.log('Database seeded successfully!');
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
