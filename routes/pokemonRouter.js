const express = require("express");
const router = express.Router();

// Import the controller functions from pokemonController
const {
  test,
  createPokemonStatus,
  getPokemonStatus,
  newPokemonEncounter,
  deletePokemonStatus,
} = require("../controllers/pokemonController");

// Define the main API route (GET request to '/')
router.get("/", (req, res) => {
  res.status(200).send("Hello, Router!");
  console.log("Successfully reached Routes");
});

// Define routes to controller functions
router.get("/test", test); // test route connection to controllers
router.post("/create", createPokemonStatus); // Route to create a brand new pokemon status
router.get("/status/:pokedex_id", getPokemonStatus); // Route to get the status of a specific Pokémon
router.post("/encounter", newPokemonEncounter); // Route to register a new Pokémon encounter
router.delete("/delete/:pokedex_id", deletePokemonStatus); // Route to delete an extisting pokemon stauts

// Export router to be reached by index.js
module.exports = router;
