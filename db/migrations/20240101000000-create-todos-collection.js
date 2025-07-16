module.exports = {
  async up(db, client) {
    // Create the todos collection
    await db.createCollection('todos');

    // Create indexes for the todos collection
    await db.collection('todos').createIndex({ userId: 1 });
    await db.collection('todos').createIndex({ completed: 1 });
    await db.collection('todos').createIndex({ createdAt: 1 });
    await db.collection('todos').createIndex({ dueDate: 1 });
    await db.collection('todos').createIndex({ 'tags': 1 });

    // Create a compound index for common queries
    await db.collection('todos').createIndex({ userId: 1, completed: 1 });

    // Insert some sample data
    await db.collection('todos').insertMany([
      {
        title: 'Complete project setup',
        description: 'Finish setting up the monorepo structure',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'system',
        priority: 'high',
        tags: ['setup', 'infrastructure'],
        schemaVersion: 1
      },
      {
        title: 'Write documentation',
        description: 'Document the project structure and setup process',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'system',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['documentation'],
        schemaVersion: 1
      }
    ]);
  },

  async down(db, client) {
    // Drop the todos collection
    await db.collection('todos').drop();
  }
};
