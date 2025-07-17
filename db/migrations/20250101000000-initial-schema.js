/**
 * Initial migration: Create todos collection with schema versioning
 */

module.exports = {
  async up(db) {
    // Create todos collection with validation schema
    await db.createCollection('todos', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'schemaVersion', 'createdAt', 'updatedAt'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            title: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Todo title is required and must be between 1-200 characters'
            },
            description: {
              bsonType: 'string',
              maxLength: 1000,
              description: 'Todo description must be less than 1000 characters'
            },
            completed: {
              bsonType: 'bool',
              description: 'Todo completion status'
            },
            priority: {
              bsonType: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Todo priority level'
            },
            dueDate: {
              bsonType: 'date',
              description: 'Todo due date'
            },
            tags: {
              bsonType: 'array',
              items: {
                bsonType: 'string'
              },
              description: 'Todo tags'
            },
            assignedTo: {
              bsonType: 'objectId',
              description: 'User ID assigned to this todo'
            },
            projectId: {
              bsonType: 'objectId',
              description: 'Project ID this todo belongs to'
            },
            schemaVersion: {
              bsonType: 'int',
              minimum: 1,
              description: 'Schema version for migration tracking'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Todo creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Todo last update timestamp'
            }
          }
        }
      }
    });

    // Create indexes for performance
    await db.collection('todos').createIndex({ title: 'text', description: 'text' });
    await db.collection('todos').createIndex({ completed: 1 });
    await db.collection('todos').createIndex({ priority: 1 });
    await db.collection('todos').createIndex({ dueDate: 1 });
    await db.collection('todos').createIndex({ assignedTo: 1 });
    await db.collection('todos').createIndex({ projectId: 1 });
    await db.collection('todos').createIndex({ createdAt: 1 });
    await db.collection('todos').createIndex({ schemaVersion: 1 });

    // Create projects collection
    await db.createCollection('projects', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'schemaVersion', 'createdAt', 'updatedAt'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Project name is required and must be between 1-100 characters'
            },
            description: {
              bsonType: 'string',
              maxLength: 1000,
              description: 'Project description must be less than 1000 characters'
            },
            status: {
              bsonType: 'string',
              enum: ['active', 'completed', 'archived'],
              description: 'Project status'
            },
            ownerId: {
              bsonType: 'objectId',
              description: 'User ID who owns this project'
            },
            members: {
              bsonType: 'array',
              items: {
                bsonType: 'objectId'
              },
              description: 'Project member user IDs'
            },
            schemaVersion: {
              bsonType: 'int',
              minimum: 1,
              description: 'Schema version for migration tracking'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Project creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Project last update timestamp'
            }
          }
        }
      }
    });

    // Create indexes for projects
    await db.collection('projects').createIndex({ name: 'text', description: 'text' });
    await db.collection('projects').createIndex({ status: 1 });
    await db.collection('projects').createIndex({ ownerId: 1 });
    await db.collection('projects').createIndex({ members: 1 });
    await db.collection('projects').createIndex({ schemaVersion: 1 });

    // Create users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'name', 'schemaVersion', 'createdAt', 'updatedAt'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Valid email address is required'
            },
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'User name is required and must be between 1-100 characters'
            },
            avatar: {
              bsonType: 'string',
              description: 'User avatar URL'
            },
            role: {
              bsonType: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'User role'
            },
            preferences: {
              bsonType: 'object',
              properties: {
                theme: {
                  bsonType: 'string',
                  enum: ['light', 'dark', 'auto']
                },
                notifications: {
                  bsonType: 'bool'
                },
                timezone: {
                  bsonType: 'string'
                }
              }
            },
            schemaVersion: {
              bsonType: 'int',
              minimum: 1,
              description: 'Schema version for migration tracking'
            },
            createdAt: {
              bsonType: 'date',
              description: 'User creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'User last update timestamp'
            }
          }
        }
      }
    });

    // Create indexes for users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ name: 'text' });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ schemaVersion: 1 });

    console.log('Initial collections created successfully');
  },

  async down(db) {
    // Drop collections in reverse order
    await db.collection('todos').drop();
    await db.collection('projects').drop();
    await db.collection('users').drop();
    
    console.log('Collections dropped successfully');
  }
};
