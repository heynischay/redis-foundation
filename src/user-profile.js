import express, { Router } from "express";
import Redis from "ioredis";
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// setting a user as raw string (not recommended )

app.post("/user/:id/", async (req, res) => {
  try {
    // only accepts strings
    const user = await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));

    return res.json({ savedAs: "json", user });
  } catch (error) {}
});

app.get("/user/:id/json", async (req, res) => {
  try {
    const data = await redis.get(`user:${req.params.id}:json`);

    return res.json(JSON.parse(data));
  } catch (error) {}
});

// setting a user as object/hash ( recommended )

app.post("/user/:id/hash", async (req, res) => {
  try {
    // only accepts objects (no need to stringify it )
    const user = await redis.hset(`user:${req.params.id}:hash`, req.body);
    await redis.expire(`user:${req.params.id}:hash`, 120);

    return res.json({ savedAs: "hash", user });
  } catch (error) {
    return res.json(error);
  }
});

// getting the hash via hgetall
app.get("/user/:id/hash", async (req, res) => {
  try {
    // returns 1 on storing new key:value and 0 on alreadyExists or any other operation
    const data = await redis.hgetall(`user:${req.params.id}:hash`);

    const expiresIn = await redis.ttl(`user:${req.params.id}:hash`);

    console.log(expiresIn);
    return res.json({ data, expiresIn });
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("Server running at port : 3000");
});
