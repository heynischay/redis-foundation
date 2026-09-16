import express from "express";
import Redis from "ioredis";
import { connectDb } from "./connectDb.js";
import crypto from "node:crypto";

import { OTP_KEY } from "./constants.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const app = express();
app.use(express.json());

// sending an otp to the provided number
app.post("/otp", async (req, res, next) => {
  const { phone } = req.body;

  console.log(phone);
  // ph no. validting step + phone number linked to a user during signup

  // creating an otp
  const otp = crypto.randomInt(100000, 1000000).toString();

  // setting key:phoneNumber => otp (value) with expiry of 5 minutes

  await redis.set(`${OTP_KEY}${phone}`, otp, "EX", 300);

  // mock phone number message service

  return res.json({ sucess: true, message: `otp:${otp}` });
});

// otp verification endpoint
app.post("/otp/:phone/", async (req, res, next) => {
  const { otp } = req.body;
  const phoneNumber = req.params.phone;

  // mock phone number validation + check phone number linked to a user in db

  // mock otp validation step

  if (!otp || !phoneNumber) {
    return res.json({ message: "otp or phone number must be required" });
  }

  // getting the otp for that user using (phone number)

  const savedOtp = await redis.get(`${OTP_KEY}${phoneNumber}`);

  console.log(savedOtp);
  console.log(otp);
  if (!savedOtp || savedOtp !== otp) {
    return res.json({ message: "otp expired or invalid" });
  }

  // otp exists and is correct

  // mark user as verified:true in the db (phone number linked to the user)

  return res.json({ message: "You are verified" });
});

app.post("/otp/:phone/expiry", async (req, res, next) => {
  const { phone } = req.params.phone;
  // checking the TTL for the otp (only for practise)

  const expiringIn = await redis.ttl(`${OTP_KEY}${phone}`);

  // returns -2 if the key expiry is reached
  if (expiringIn === -2) {
    return res.json({ message: "otp expired" });
  }

  // returning the time left to submit the otp
  return res.json({ expiringIn });
});

app.listen(3000, async () => {
  await connectDb();
  console.log("Server running at port : 3000");
});
