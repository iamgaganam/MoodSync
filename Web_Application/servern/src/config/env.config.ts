import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  mongoUriProd: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
  bcryptSaltRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/moodsync",
  mongoUriProd:
    process.env.MONGODB_URI_PROD || "mongodb://localhost:27017/moodsync_prod",
  jwtSecret: process.env.JWT_SECRET || "fallback_jwt_secret_not_secure",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100",
    10
  ),
  logLevel: process.env.LOG_LEVEL || "info",
};

// Validate critical configuration
const validateConfig = (): void => {
  if (config.nodeEnv === "production") {
    // In production, ensure we have proper secrets and configuration
    if (config.jwtSecret === "fallback_jwt_secret_not_secure") {
      console.error("ERROR: JWT_SECRET is not set in production environment!");
      process.exit(1);
    }

    if (!process.env.MONGODB_URI_PROD) {
      console.error(
        "ERROR: MONGODB_URI_PROD is not set in production environment!"
      );
      process.exit(1);
    }
  }
};

validateConfig();
