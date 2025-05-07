import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { config } from "./config/env.config";

// Import routes
import authRoutes from "./routes/auth.routes";

// Create Express app
const app: Express = express();

// Middleware
// Security headers
app.use(helmet());

// CORS config
app.use(
  cors({
    origin: config.clientUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Request logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 minutes
  max: config.rateLimitMaxRequests, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    message:
      config.nodeEnv === "development" ? err.message : "Internal server error",
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });
});

export default app;
