import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../mongodb';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
}));

describe('MongoDB Connection', () => {
  beforeEach(() => {
    // Reset mocks and cached connection
    jest.clearAllMocks();

    // Reset the cached connection
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
  });

  it('should connect to MongoDB', async () => {
    await connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledWith(
      expect.stringContaining('mongodb://'),
      expect.objectContaining({ bufferCommands: false })
    );
  });

  it('should reuse existing connection if available', async () => {
    // First connection
    await connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);

    // Second connection should reuse the first
    await connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await expect(connectToDatabase()).rejects.toThrow('Connection failed');
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from MongoDB', async () => {
    // Setup a mock connection
    global.mongoose = { conn: {}, promise: Promise.resolve({}) };

    await disconnectFromDatabase();
    expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
    expect(global.mongoose.conn).toBeNull();
    expect(global.mongoose.promise).toBeNull();
  });

  it('should not attempt to disconnect if no connection exists', async () => {
    // Ensure no connection exists
    global.mongoose = { conn: null, promise: null };

    await disconnectFromDatabase();
    expect(mongoose.disconnect).not.toHaveBeenCalled();
  });
});
