import express from "express";
import Redis from "ioredis";
import { connectDb } from "./connectDb.js";
import { BANNER_KEY } from "./constants.js";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const app = express();
app.use(express.json());
app.post("/banner", async (req, res, next) => {
  const banner = req.body.banner;

  console.log("ran");

  if (!banner) {
    return res.json({ sucess: false, message: "banner must be required" });
  }

  await redis.set(BANNER_KEY, banner);
  return res.json({ sucess: true, message: `banner :${banner} created` });
});

app.get("/banner", async (req, res, next) => {
  const banner = await redis.get(BANNER_KEY);

  if (!banner) {
    return res.json({ sucess: false, message: "banner not found" });
  }
  return res.json({ banner });
});

app.get("/banner/key", async (req, res, next) => {
  const exists = await redis.get(BANNER_KEY);

  return res.json({ exists: !!exists });
});

app.delete("/banner", async (req, res, next) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true });
});

app.listen(3000, async () => {
  await connectDb();
  console.log("Server running at port : 3000");
});
