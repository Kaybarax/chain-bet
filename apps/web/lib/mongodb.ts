import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'chainbet';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// Connection caching for serverless environments
declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
}

export async function getMongoClient() {
  if (global._mongoClient && global._mongoDb) {
    return { client: global._mongoClient, db: global._mongoDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  global._mongoClient = client;
  global._mongoDb = db;

  return { client, db };
}
