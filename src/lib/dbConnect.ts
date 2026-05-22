import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("✅ Already connected to database");
        return;
    }

    if (!process.env.MONGODB_URI) {
        const errorMsg = "❌ MONGODB_URI is not configured in environment variables";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        console.log("🔄 Attempting database connection...");
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        });

        connection.isConnected = db.connections[0].readyState;
        retryCount = 0; // Reset retry counter on success
        console.log("✅ Connected to database successfully");
    } catch (error) {
        retryCount++;
        const typedError = error as Error & { code?: number };
        const isDev = process.env.NODE_ENV === 'development';
        
        // Authentication error
        if (typedError.message?.includes('authentication failed') || typedError.code === 8000) {
            console.error(
                "❌ Database Authentication Failed\n" +
                "   This means your MongoDB credentials are invalid.\n" +
                "   Please check:\n" +
                "   1. Username and password are correct\n" +
                "   2. IP address is whitelisted in MongoDB Atlas\n" +
                "   3. User account is active\n" +
                "   See MONGODB_FIX_GUIDE.md for detailed instructions"
            );
            if (!isDev) throw error;
        }
        
        // Connection refused error (local MongoDB not running)
        else if (typedError.message?.includes('ECONNREFUSED')) {
            console.error(
                "❌ Database Connection Refused\n" +
                "   MongoDB is not running or unreachable.\n" +
                "   For local development, ensure MongoDB is running.\n" +
                "   Or check your MONGODB_URI configuration."
            );
            if (!isDev) throw error;
        }
        
        // Network error
        else if (typedError.message?.includes('ENOTFOUND') || typedError.message?.includes('getaddrinfo')) {
            console.error(
                "❌ Network Error: Cannot resolve MongoDB host\n" +
                "   Check your MongoDB connection string and internet connection"
            );
            if (!isDev) throw error;
        }
        
        // Retry logic for transient errors
        if (retryCount < MAX_RETRIES && isDev) {
            console.warn(
                `⚠️  Connection attempt ${retryCount}/${MAX_RETRIES} failed.\n` +
                `⏳ Retrying in ${RETRY_DELAY}ms...`
            );
            await delay(RETRY_DELAY);
            return dbConnect();
        }

        console.error("❌ Database connection failed:", typedError.message);
        console.error("\n📖 For help, see MONGODB_FIX_GUIDE.md");
        
        // In development, log but don't crash - let API handle the error
        if (!isDev) {
            throw error;
        } else {
            console.warn("⚠️  Continuing in development mode without database connection");
        }
    }
}

export default dbConnect;