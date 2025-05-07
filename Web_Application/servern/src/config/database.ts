import mongoose from "mongoose";
import { config } from "./env.config";
import winston from "winston";

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// MongoDB connection options
const options: mongoose.ConnectOptions = {
  // Options are now defined by the connection string in newer versions
};

// Connect to MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const connectionString =
      config.nodeEnv === "production" ? config.mongoUriProd : config.mongoUri;

    await mongoose.connect(connectionString);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    // Exit process with failure
    process.exit(1);
  }
};

// Disconnect from MongoDB (useful for testing)
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  } catch (error) {
    logger.error("MongoDB disconnection error:", error);
  }
};

// MongoDB connection events
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose disconnected from MongoDB");
});

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed due to app termination");
  process.exit(0);
});
