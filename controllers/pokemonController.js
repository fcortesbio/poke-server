// Import pokemonStatus model
const pokemonStatus = require("../models/pokemonModels");

// Export test response to controllers; found at: localhost:<port>/<pokemonRouter>/test
exports.test = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully reached Controllers");
};

// Export controller for creating a new pokemonStatus (CREATE)
exports.createPokemonStatus = async (req, res) => {
  try {
    // Input validation:
    const pokedex_id = parseInt(req.body.pokedex_id);
    if (isNaN(pokedex_id)) {
      return res.status(400).json({ error: "Invalid pokedex_id" });
    }

    if (pokedex_id < 1 || pokedex_id > 151) {
      return res.status(400).json({
        error: "Pokémon outside Kanto are yet to be available"
      });
    }

    // Check if a status already exists for this user and pokedex_id:
    const existingStatus = await pokemonStatus.findOne({
      pokedex_id: pokedex_id,
      user: req.body.userId
    });

    if (existingStatus) {
      return res.status(409).json({ error: "Pokémon status already exists" });
    }

    // Create a new pokemonStatus document:
    const status = await pokemonStatus.create({
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

    res.status(201).json(status);
    console.log(`Created pokemonStatus for: Pokédex ID: ${req.body.pokedex_id}`);

  } catch (err) {
    console.error(`Can't create Pokémon Status: ${err}`);
    res.status(500).json({ error: err.message }); // Send only the error message
  }
};

// Export controller for retrieving pokemonStatus by pokedex_id (READ)
exports.getPokemonStatus = async (req, res) => {
  try {
    const { pokedex_id } = req.params; // Assuming the ID is passed as a route parameter
    const status = await pokemonStatus.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!status) {
      return res.status(404).json({ message: "Pokémon Status was not found." });
    }

    res.status(200).json({
      encounters: status.encounters,
      catches: status.catches,
    });
  } catch (err) {
    console.error(`Pokemon status could not be retrieved: ${err}`);
    res.status(500).json({ err });
  }
};

// Export controller for registering a new Pokemon encounter (UPDATE)
exports.newPokemonEncounter = async (req, res) => {
  try {
    const { pokedex_id, shiny, gender, isCatch } = req.body; // Get gender from request
    const status = await pokemonStatus.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!status) {
      return res
        .status(404)
        .json({ message: "Pokemon not found, create a new status first." });
    }

    // Construct the encounter and catch keys based on gender and shiny status
    const encounterKey = `${gender ? "male" : "female"}_${shiny ? "shiny" : "normal"
      }`;
    const catchKey = `${gender ? "male" : "female"}_${shiny ? "shiny" : "normal"
      }`;

    // Update encounters and catches
    status.encounters[encounterKey] = true;
    status.encounters.counter += 1; // Increment total encounter counter
    if (isCatch) {
      status.catches[catchKey] = true;
      status.catches.counter += 1; // Increment total catch counter
    }

    await status.save();
    res
      .status(200)
      .json({ message: "Encounter registered successfully", status });
  } catch (err) {
    console.error(`Unable to register Pokemon encounter: ${err}`);
    res.status(500).json({ err });
  }
};

// Export controller for deleting a pokemonStatus by pokedex_id (DELETE)
exports.deletePokemonStatus = async (req, res) => {
  try {
    const { pokedex_id } = req.params; // Assuming the pokedex ID is passed as a route parameter
    const userId = req.body.userId; // Assuming user ID is passed in the request body

    const status = await pokemonStatus.findOneAndDelete({
      pokedex_id,
      user: userId,
    });

    if (!status) {
      return res.status(404).json({ message: "Pokemon status not found." });
    }

    res.status(200).json({ message: "Pokemon status deleted successfully." });
  } catch (err) {
    console.error(`Unable to delete Pokemon status: ${err}`);
    res.status(500).json({ err });
  }
};
