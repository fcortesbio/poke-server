const express = require("express");
const pokedex = express.Router();

// Import the controller functions from pokemonController
const {
  newPokedexEntry,
  updatePokedexEntry,
  getPokedexEntry,
} = require("../controllers/pokedexController");

// Define the main API route (GET request to '/')
pokedex.get("/", (req, res) => res.status(200).send("Hello, Pokedex!"));

// Define routes to controller functions
pokedex.post("/new", newPokedexEntry); // register an entry for a new pokemon ID
pokedex.patch("/:pokedex_id", updatePokedexEntry); // update encounters/catches for a given pokemon ID entry
pokedex.get("/:pokedex_id", getPokedexEntry); // retrieves the pokedex entry 

// Export router to be reached by index.js
module.exports = pokedex;