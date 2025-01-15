const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUsername,
  checkPassword,
  logoutUser,
  getUserProfile,
  updateUserEmail,
  updateUsername,
  updateCountry,
  updatePassword,
  deleteUserAccount, 
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/cookieJwtAuth");
const pokedex = require("./pokedexRouter");
// const session = require("express-session"); // not used

// testing route
// Authentication and sign up 
router.post("/signup", registerUser);
router.get("/login", checkUsername);
router.post("/login/auth", checkPassword);
router.post("/logout", logoutUser);

// --- JWT protected routes ---
router.get("/profile", authenticateToken, getUserProfile); // fetch profile details
router.use("/pokedex/", authenticateToken, pokedex); // connection with pokemonRouter

// --- User update routes (protected) ---
router.patch("/email", authenticateToken, updateUserEmail);
router.patch("/username", authenticateToken, updateUsername);
router.patch("/country", authenticateToken, updateCountry);
router.patch("/password", authenticateToken, updatePassword);

// --- Account deletion route (protected) ---
router.delete("/account", authenticateToken, deleteUserAccount);

module.exports = router;