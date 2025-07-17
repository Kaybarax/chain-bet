/**
 * Add categories and subcategories to todos schema
 */

module.exports = {
  async up(db) {
    // Update todos collection schema to add categories
    await db.runCommand({
      collMod: 'todos',
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
            category: {
              bsonType: 'string',
              enum: ['work', 'personal', 'shopping', 'health', 'education', 'other'],
              description: 'Todo category'
            },
            subcategory: {
              bsonType: 'string',
              maxLength: 50,
              description: 'Todo subcategory'
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

    // Create indexes for new fields
    await db.collection('todos').createIndex({ category: 1 });
    await db.collection('todos').createIndex({ subcategory: 1 });
    await db.collection('todos').createIndex({ category: 1, subcategory: 1 });

    // Update existing documents to schema version 2
    await db.collection('todos').updateMany(
      { schemaVersion: { $exists: false } },
      { 
        $set: { 
          schemaVersion: 2,
          category: 'other',
          updatedAt: new Date()
        }
      }
    );

    console.log('Added categories and subcategories to todos schema');
  },

  async down(db) {
    // Remove category and subcategory fields
    await db.collection('todos').updateMany(
      {},
      { 
        $unset: { 
          category: "",
          subcategory: ""
        },
        $set: {
          schemaVersion: 1,
          updatedAt: new Date()
        }
      }
    );

    // Drop indexes
    await db.collection('todos').dropIndex({ category: 1 });
    await db.collection('todos').dropIndex({ subcategory: 1 });
    await db.collection('todos').dropIndex({ category: 1, subcategory: 1 });

    console.log('Removed categories and subcategories from todos schema');
  }
};
