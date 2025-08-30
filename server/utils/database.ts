import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://satyakachatgpt_db_user:ANILSHARMA12@cluster0.1pgdsl0.mongodb.net/posttrr';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('Connected to MongoDB Atlas');
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { mongoose };
