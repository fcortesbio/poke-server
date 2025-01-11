// Import pokemonStatus model
const pokemonStatus = require("../models/pokemonModels");

// Export test response to controllers; found at: localhost:<port>/<pokemonRouter>/test
exports.test = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully reached Controllers");
};

// Export controller for retrieving pokemonStatus by pokedex_id
exports.getPokemonStatus = async (req, res) => {
  try {
    const { pokedex_id } = req.params; // Assuming the ID is passed as a route parameter
    const status = await pokemonStatus.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!status) {
      return res
        .status(404)
        .json({ message: "Pokemon has not been encountered." });
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

// Export controller for creating a new pokemonStatus
exports.createPokemonStatus = async (req, res) => {
  try {
    // Create a new pokemonStatus document using data from the request body
    const status = await pokemonStatus.create({
      pokedex_id: req.body.pokedex_id,
      encounters: {
        normal: req.body.normalEncounters || 0,
        shiny: req.body.shinyEncounters || 0,
      },
      catches: {
        normal: req.body.normalCatches || 0,
        shiny: req.body.shinyCatches || 0,
      },
      candies: req.body.candies || 0,
      user: req.body.userId, // Assuming user ID is passed in the request body
    });

    res.status(201).json(status); // Send new pokemonStatus as JSON response
    console.log(
      `Created pokemonStatus for: Pokedex ID: ${req.body.pokedex_id}`
    );
  } catch (err) {
    // Log error message if the pokemonStatus creation fails
    console.error(`Unable to create pokemon Status: ${err}`);
    res.status(500).json({ err });
  }
};

// Export controller for registering a new Pokemon encounter
exports.newPokemonEncounter = async (req, res) => {
  try {
    const { pokedex_id, isShiny, isCatch } = req.body;
    const status = await pokemonStatus.findOne({
      pokedex_id,
      user: req.body.userId,
    });

    if (!status) {
      return res
        .status(404)
        .json({ message: "Pokemon not found, create a new status first." });
    }

    // Update encounters and catches based on the request
    if (isShiny) {
      status.encounters.shiny += 1;
      if (isCatch) status.catches.shiny += 1;
    } else {
      status.encounters.normal += 1;
      if (isCatch) status.catches.normal += 1;
    }

    await status.save(); // Save the updated document
    res
      .status(200)
      .json({ message: "Encounter registered successfully", status });
  } catch (err) {
    console.error(`Unable to register Pokemon encounter: ${err}`);
    res.status(500).json({ err });
  }
};
