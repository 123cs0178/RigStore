import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // 5173 is Vite's default port
app.use(express.json()); // parses incoming JSON request bodies
app.use(cookieParser());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "RigStore API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});