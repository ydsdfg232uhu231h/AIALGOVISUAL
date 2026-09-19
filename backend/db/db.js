import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Database connection error");
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function handleconnecttosdb() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((error) => {
      cached.promise = null;
      console.error("DB connection error:", error);
      throw new Error("Failed to connect to Database");
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export async function handledisconnecttodb() {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  if (cached.conn || mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
    } catch (error) {
      console.error("DB disconnect error:", error);
      throw new Error("Failed to disconnect from Database");
    }
  }
}