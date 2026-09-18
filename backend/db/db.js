import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env");
}


let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function handleconnecttosdb() {
  // Return cached connection if active
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Create connection promise if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if commands are run before connection is ready
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((error) => {
      cached.promise = null; // Clear promise on failure to allow retries
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
    // Avoid disconnecting in development to preserve connection during hot-reloads
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