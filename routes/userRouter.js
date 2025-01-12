const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUsername,
  checkPassword,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/cookieJwtAuth");

// -- User Authentication Handling routes: --

// Define the main API route (GET request to '/')
router.get("/", (req, res) => res.status(200).send("Hello, User!"));

router.post("/signup", registerUser); // sign up a new user (CREATE)
router.post("/login/username", checkUsername); // check username
router.post("/login/password", checkPassword); // check username+password

// --- JWT protected routes:
router.get("profile/", authenticateToken, (req, res) => {
  res.json({ user: req.user });
  console.log("route profile reached!");
});

module.exports = router;
