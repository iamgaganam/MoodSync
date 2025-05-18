// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(
  process.env.NODE_ENV === "development" ? morgan("dev") : morgan("combined")
);

// Serve static files for profile images
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    res.status(err.status || 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);

// Connect to MongoDB and start server
async function startServer(): Promise<void> {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/moodsync";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");

    server.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
      console.log(`API access at http://localhost:${PORT}/api`);
      console.log(`WebSocket server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
