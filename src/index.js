import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import { connectDb } from "./connectDb.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const app = express();

app.get("/redis", async (req, res, next) => {
  const reply = await redis.ping();

  res.json({ redis: reply });
});

app.get("/mongo", async (req, res, next) => {
  res.json({ mongo: "connected", database: mongoose.connection.db.databaseName });
});

app.listen(3000, async () => {
  await connectDb();
  console.log("Server running at port : 3000");
});
