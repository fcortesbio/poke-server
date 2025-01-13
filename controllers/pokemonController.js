// Import pokemonStatus model
const pokedexEntry = require("../models/pokedexSch");

// Export test response to controllers;
exports.pokedex = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully accessed Controllers");
};

// Export controller for creating a new pokedexEntry (CREATE)
exports.createPokedexEntry = async (req, res) => {
  try {
    // Input validation:
    const pokedex_id = parseInt(req.body.pokedex_id);
    if (isNaN(pokedex_id)) {
      return res.status(400).json({ error: "Invalid pokedex_id" });
    }

    if (pokedex_id < 1 || pokedex_id > 151) {
      return res.status(400).json({
        error: "Pokémon outside Kanto are yet to be available",
      });
    }

    // Check if a status already exists for this user and pokedex_id:
    const existingEntry = await pokedexEntry.findOne({
      pokedex_id: pokedex_id,
      user: req.body.userId,
    });

    if (existingEntry) {
      return res.status(409).json({ error: "Pokémon entry already exists" });
    }

    // Create a new pokemonEntry document:
    const entry = await pokedexEntry.create({
      pokedex_id: pokedex_id,

      encounters: {
        male_normal: req.body.maleNormalEncounters || false,
        male_shiny: req.body.maleShinyEncounters || false,
        female_normal: req.body.femaleNormalEncounters || false,
        female_shiny: req.body.femaleShinyEncounters || false,
        counter: 0,
      },

      catches: {
        male_normal: req.body.maleNormalCatches || false,
        male_shiny: req.body.maleShinyCatches || false,
        female_normal: req.body.femaleNormalCatches || false,
        female_shiny: req.body.femaleShinyCatches || false,
        counter: 0,
      },

      candies: req.body.candies || 0,
      user: req.body.userId,
    });

    res.status(201).json(entry);
    console.log(`Created entry for: Pokédex ID: ${req.body.pokedex_id}`);
  } catch (err) {
    console.error(`Can't create Pokédex entry: ${err}`);
    res.status(500).json({ error: err.message }); // Send only the error message
  }
};

// Export controller for retrieving pokedexEntry by pokedex_id (READ)
exports.getEntryById = async (req, res) => {
  try {
    const { pokedex_id } = req.params; // Assuming the ID is passed as a route parameter
    const entry = await pokedexEntry.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!entry) {
      return res.status(404).json({ error: "Pokédex entry was not found." });
    }

    res.status(200).json({
      encounters: entry.encounters,
      catches: entry.catches,
    });
  } catch (err) {
    console.error(`Pokédex entry could not be retrieved: ${err}`);
    res.status(500).json({ error: err.message });
  }
};

// Export controller for registering a new Pokemon encounter (UPDATE)
exports.newPokemonEncounter = async (req, res) => {
  try {
    const { pokedex_id, shiny, gender, isCatch } = req.body; // Get gender from request
    const entry = await pokedexEntry.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!entry) {
      return res
        .status(404)
        .json({
          message: "Pokémon not found, create a new Pokédex entry first.",
        });
    }

    // Construct the encounter and catch keys based on gender and shiny status
    const encounterKey = `${gender ? "male" : "female"}_${shiny ? "shiny" : "normal"}`;
    const catchKey = `${gender ? "male" : "female"}_${shiny ? "shiny" : "normal"}`;

    // Update encounters and catches
    entry.encounters[encounterKey] = true;
    entry.encounters.counter += 1; // Increment total encounter counter
    if (isCatch) {
      entry.catches[catchKey] = true;
      entry.catches.counter += 1; // Increment total catch counter
    }

    await entry.save();
    res
      .status(200)
      .json({ 
        message: "Encounter registered successfully", 
        entry:{
          encounters: entry.encounters,
          catches: entry.catches
        }
      });
  } catch (err) {
    console.error(`Unable to register Pokemon encounter: ${err}`);
    res.status(500).json({ error: err.message });
  }
};

// Export controller for deleting a pokedexEntry by pokedex_id (DELETE)
exports.deletePokedexEntry = async (req, res) => {
  try {
    const { pokedex_id } = req.params;
    const userId = req.body.userId;

    const entry = await PokedexEntry.findOneAndDelete({ // Use PokedexEntry here
      pokedex_id,
      user: userId,
    });

    if (!entry) {
      return res.status(404).json({ message: "Pokédex entry not found." });
    }

    res.status(200).json({
      message: `Removed Pokédex entry for user: ${userId} and Pokédex ID: ${pokedex_id}.`
    });
  } catch (err) {
    console.error(`Cannot delete Pokédex entry: ${err}`);
    res.status(500).json({ error: err.message }); // Consistent error response
  }
};