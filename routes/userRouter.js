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
const pokedex = require("../routes/pokemonRouter");

// testing route
// Authentication and sign up 
router.post("/signup", registerUser);
router.post("/intro", checkUsername);
router.post("/login", checkPassword);
router.post("/logout", logoutUser);

// --- JWT protected routes ---
router.get("/:userId", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.post(":/userId/profile", authenticateToken, getUserProfile); // fetch profile details
router.use(":/userId/pokedex/", authenticateToken, pokedex); // connection with pokemonRouter

// --- User update routes (protected) ---
router.patch('/:userId/email', authenticateToken, updateUserEmail);
router.patch('/:userId/username', authenticateToken, updateUsername);
router.patch('/:userId/country', authenticateToken, updateCountry);
router.patch('/:userId/password', authenticateToken, updatePassword);

// --- Account deletion route (protected) ---
router.delete('/:userId/account', authenticateToken, deleteUserAccount);

module.exports = router;