import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

// Set the connection URI and options
const uri = process.env.MONGO_URI

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectToMongo = async () => {
    try {
        // Connect to MongoDB using Mongoose with specified options
        await mongoose.connect(uri);

        // Ping the MongoDB server to confirm connection
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log(colors.cyan + 'MongoDB connected and pinged successfully!' + colors.reset);
    } catch (error) {
        console.error(colors.red + "Error in connection: " + error + colors.reset);
    } finally {
        // Optionally, you can disconnect after the ping test (not common for long-running apps)
        // await mongoose.disconnect();
    }
};

export default connectToMongo
