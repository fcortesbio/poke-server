const User = require("../models/users");
const {
  validateRegistration,
  validateUsername,
  validatePassword,
  emailSchema,
  usernameSchema,
  countrySchema,
  passwordSchema,
} = require("../validators/validation");

const { generateToken } = require("../middleware/cookieJwtAuth");
require("dotenv").config();

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
  const { error, value } = validateUsername(req.body.username);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const user = await User.findOne({ username: value }, "_id");
    if (!user) {
      req.session.destroy((err) => { 
        if (err) console.error(`Error destroying session: ${err}`);
      });
      return res.status(404).json({ error: "Username not found" });
    }

    req.session.userId = user._id;
    res.json({ message: "Username found" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkPassword = async (req, res) => {
  const { error, value } = validatePassword(req.body.password);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Username not found in session" });
    }
    const user = await User.findById(userId, "password"); // Fetch only the password
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect access" });
    const completeUser = await User.findById(userId);
    completeUser.lastLogin = Date.now();
    await completeUser.save();
    const token = generateToken(completeUser);
    res.cookie("token", token);
    res.json({ message: "User logged in" });
  } catch (err) {
    console.error({ error: err.message });
    res.status(500).json({ error: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(`Error destroying session: ${err}`);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("token");
      res.json({ message: "User logged out succesfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = {
      username: user.username,
      email: user.email,
      roles: user.roles,
      birthday: user.birthday,
      country: user.country,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

const updateUserEmail = async (req, res) => {
  try {
    const userId = req.session.userId;
    const newEmail = req.body.email;

    // validate the new email
    const { error, value } = emailSchema.validate(newEmail);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // find the user and update the email
    const user = await User.findByIdAndUpdate(
      userId,
      { email: value },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Email address updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update email" });
  }
};

const updateUsername = async (req, res) => {
  try {
    const userId = req.session.userId;
    const newUsername = req.body.username;
    // validate username
    const { error, value } = usernameSchema.validate(newUsername);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // find the user and update the username
    const user = await User.findByIdAndUpdate(
      userId,
      { username: value },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Username updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update username" });
  }
};

const updateCountry = async (req, res) => {
  const userId = req.session.userId;
  const newCountry = req.body.country;
  const { error, value } = countrySchema.validate(newCountry);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = await User.findByIdAndUpdate(
    userId,
    { country: value },
    { new: true, runValidators: true }
  );
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;
    // validate new password
    const { error, value } = passwordSchema.validate(newPassword);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    // compare current pasword
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ error: "Incorrect access" });
    // update password (this will trigger our pre-save hash)
    user.password = value;
    await user.save();
    res.json({ message: "Updated password" });
  } catch (err) {}
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.session.userId;
    const currentPassword = req.body.password;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({});
    async () => await User.findByIdAndDelete(userId);
    req.session.destroy((err) => {
      if (err) {
        console.error(`Error destroying session`);
        return res
          .status(500)
          .json({ error: "Account deleted, but logout failed" });
      }
      res.clearCookie("token");
      res.json({ message: "Account deleted succesfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

module.exports = {
  registerUser,
  checkUsername,
  checkPassword,
  logoutUser,
  getUserProfile,
  updateUserEmail,
  updateUsername,
  updateCountry,
  updatePassword,
  deleteUserAccount
};
