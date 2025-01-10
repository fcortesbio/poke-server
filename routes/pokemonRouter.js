const express = require("express");
const router = express.Router();

// Import the 'test' controller function from the pokemonController
const { test, createPokemonStatus } = require("../controllers/pokemonController"); 

// Define the main API route (GET request to '/')
router.get("/", (req, res) => {
  res.status(200).send("Hello, Router!"); 
  console.log("Successfully reached Routes"); 
});

// Define routes to controller functions
router.get("/test", test); 
router.post("/create", createPokemonStatus)


// Export router to be reached by index.js
module.exports = router;