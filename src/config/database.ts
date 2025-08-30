import mongoose from 'mongoose';

// MongoDB connection configuration for Mongoose 8.x
export const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/financeai',
  OPTIONS: {
    // Mongoose 8.x compatible options
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // Remove deprecated options that cause warnings
  }
};

// Database connection function
export const connectDatabase = async (): Promise<void> => {
  try {
    // Clear any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(MONGODB_CONFIG.URI, MONGODB_CONFIG.OPTIONS);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

// Database disconnection function
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    throw error;
  }
};

// Check database connection status
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
