import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.urlencoded({ extended: true }));
app.use(
  process.env.NODE_ENV === "development" ? morgan("dev") : morgan("combined")
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes - Mount the auth routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    res.status(500).json({
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
async function startServer() {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/moodsync";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
      console.log(`API access at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
