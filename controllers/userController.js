const {
  validateRegistration,
  validateUsername,
  validatePassword,
} = require("../validators/validation");
const { generateToken } = require("../middleware/cookieJwtAuth");

const User = require("../models/users");

const registerUser = async (req, res) => {
  const { error, value } = validateRegistration(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = new User(value);
    await user.save();
    res.status(201).json({ message: "New user registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkUsername = async (req, res) => {
  const { error, value } = validateUsername(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await User.findOne({ username: value.username });
    if (!user) return res.status(404).json({ error: error.details[0].message });
    req.session.username = value.username;
    res.json({ message: "Username found and stored" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkPassword = async (req, res) => {
  const { error, value } = validatePassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const username = req.session.username;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: error.details[0].message });
    }

    const isMatch = await user.comparePassword(value.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect access" });
    }

    const token = generateToken(user);
    res.cookie("token", token);
    res.json({ message: "User logged in" });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  checkUsername,
  checkPassword,
};
