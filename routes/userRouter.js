const express = require("express");
const router = express.Router();
const {
  validateRegistration,
  validatePassword,
  validateUsername,
} = require("../validators/validation");
const User = require("../models/users");

// Route for registration
router.post("/signup", async (req, res) => {
  const { error, value } = validateRegistration(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = new User(value); // Use the validated data (value)
    await user.save();
    res.status(201).json({ message: "New user registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for login username check
router.post("/login/username", async (req, res) => {
  const { error, value } = validateUsername(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await User.findOne({ username: value.username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }
    res.json({ message: "Username found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for password check (username validated)
router.post("/login/password", async (req, res) => {
  const { error, value } = validatePassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // username must be stored in the session
    const username = req.session.username;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ error: "Incorrect access" });
    }

    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect access" });
    }

    // ... generate and send JWT
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
