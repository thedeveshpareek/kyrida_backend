import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import VerificationToken from "../models/verificationToken.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already registered" });

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    // Generate token & save in DB
    // const tokenString = crypto.randomBytes(32).toString("hex");
    const tokenString = Math.floor(100000 + Math.random() * 900000).toString(); 
// generates a 6-digit number like "483920"
    await VerificationToken.create({
      userId: user._id,
      token: tokenString,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send only token in email
    await sendEmail(
      user.email,
      "Your Verification Token",
      `
        <h2>Hi ${user.name},</h2>
        <p>Use the token below to verify your email:</p>
        <p style="font-size:18px;font-weight:bold;color:#007bff;">${tokenString}</p>
        <p>This token will expire in 24 hours.</p>
      `
    );

    res.status(201).json({
      msg: "User registered successfully. Please check your email for the verification token.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    console.log(user);

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    console.log(token);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        isVerified: user.verified,
        suspended: user.suspended,
        banned: user.banned
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// import VerificationToken from "../models/verificationToken.model.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const record = await VerificationToken.findOne({ token });
    if (!record) return res.status(400).json({ msg: "Invalid or expired token" });

    if (record.expiresAt < Date.now()) {
      await VerificationToken.deleteOne({ _id: record._id });
      return res.status(400).json({ msg: "Token expired" });
    }

    const user = await User.findById(record.userId);
    if (!user) return res.status(400).json({ msg: "User not found" });

    user.verified = true;
    await user.save();

    await VerificationToken.deleteOne({ _id: record._id });

    res.json({ msg: "✅ Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
