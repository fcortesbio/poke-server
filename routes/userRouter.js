const express = require("express");
const router = express.Router();
const { registerUser, checkUsername, checkPassword } = require("../controllers/userController");

// Route for registration
router.post("/signup", registerUser); 

// Route for login username check
router.post("/login/username", checkUsername); 

// Route for password check (username validated)
router.post("/login/password", checkPassword); 

module.exports = router;