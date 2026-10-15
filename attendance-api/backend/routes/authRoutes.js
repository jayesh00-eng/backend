const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/Faculty");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Faculty.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful.",
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (!faculty || !(await bcrypt.compare(password || "", faculty.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: faculty._id.toString(), email: faculty.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;