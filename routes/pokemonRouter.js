const express = require("express");
const router = express.Router();

// Import the controller functions from pokemonController
const {
  test,
  createPokemonStatus,
  getPokemonStatus,
  newPokemonEncounter,
} = require("../controllers/pokemonController");

// Define the main API route (GET request to '/')
router.get("/", (req, res) => {
  res.status(200).send("Hello, Router!");
  console.log("Successfully reached Routes");
});

// Define routes to controller functions
router.get("/test", test);
router.post("/create", createPokemonStatus);
router.get("/status/:pokedex_id", getPokemonStatus); // Route to get the status of a specific Pokémon
router.post("/encounter", newPokemonEncounter); // Route to register a new Pokémon encounter

// Export router to be reached by index.js
module.exports = router;
