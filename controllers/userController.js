const User = require("../models/users");
const {
  validateRegistration,
  validateUsername,
  validatePassword,
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
    const user = await User.findOne({ username: value }); 
    if (!user) {
      return res.status(404).json({ error: "Username not found" }); 
    }
    req.session.username = value;
    res.json({ message: "Username found" }); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: "Internal server error" }); 
  }
};

const checkPassword = async (req, res) => {
  const { error, value } = validatePassword(req.body.password); // Call validatePassword only once  
  console.log(`Marker 7 -> Validation results object:`, { error, value }); // Log the result directly
  if (error) { 
    return res.status(400).json({ error: error.details[0].message });
  } 
  try {
    console.log("username from session: " + req.session.username);
    const user = await User.findOne({ username: req.session.username }); // Separate the query
    console.log("Found user:", user); // Log the user object

    if (!user) return res.status(404).json({ error: error.details[0].message })
    
    console.log("reached this point!")
    console.log("HTTPr password:", req.body.password)
    const isMatch = await user.comparePassword(req.body.password);
    
    console.log("Marker 9: Compare password", isMatch);
    console.log("reached this point!")
    if (!isMatch) return res.status(401).json({ error: "Incorrect access" });
    
    // record last login event
    user.lastLogin = Date.now();
    await user.save();
    // store userId in session    
    req.session.userId = user.id;
    // generate and export JWT token and produce response
    const token = generateToken(user);
    res.cookie("token", token);
    console.log("Reached this point!")
    res.json({message: "User logged in"});
    
  } catch (err) {
    console.error({error: err.message})
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
      res.clearCookie("token"); // clear jwt token
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
    if (!user) return res.status(404).json({error: "User not found"});
    
    const profile = {
      username : user.username,
      email : user.email, 
      roles : user.roles,
      birthday: user.birthday,
      country: user.country,
      createdAt : user.createdAt,
      lastLogin : user.lastLogin,
      // encountered: user.encountered we'll see later 
      // catched: user.catched we'll see later 
    }
    
    res.json({profile}); /// what data should we filter from profile?

  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to fetch user profile"})
  }
}

// const updateUserPassword = 

// const updateUserEmail = 

// const updateBirthday = 

// const updateCountry = 


module.exports = {
  registerUser,
  checkUsername,
  checkPassword,
  logoutUser,
  getUserProfile,
};