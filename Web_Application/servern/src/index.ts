import express, { Request, Response } from "express";

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON body parsing
app.use(express.json());

// Define a simple route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello TypeScript Backend!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
