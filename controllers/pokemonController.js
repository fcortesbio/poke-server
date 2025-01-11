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
// Export controller for registering a new Pokemon encounter
exports.newPokemonEncounter = async (req, res) => {
  try {
    const { pokedex_id, shiny, gender, isCatch } = req.body; // Get gender from request
    const status = await pokemonStatus.findOne({ pokedex_id, user: req.body.userId });

    if (!status) {
      return res.status(404).json({ message: "Pokemon not found, create a new status first." });
    }

    // Construct the encounter and catch keys based on gender and shiny status
    const encounterKey = `${gender ? 'male' : 'female'}_${shiny ? 'shiny' : 'normal'}`;
    const catchKey = `${gender ? 'male' : 'female'}_${shiny ? 'shiny' : 'normal'}`;

    // Update encounters and catches
    status.encounters[encounterKey] = true; 
    status.encounters.counter += 1; // Increment total encounter counter
    if (isCatch) {
      status.catches[catchKey] = true;
      status.catches.counter += 1; // Increment total catch counter
    }

    await status.save();
    res.status(200).json({ message: "Encounter registered successfully", status });
  } catch (err) {
    console.error(`Unable to register Pokemon encounter: ${err}`);
    res.status(500).json({ err });
  }
};

// Export controller for deleting a pokemonStatus by pokedex_id
exports.deletePokemonStatus = async (req, res) => {
  try {
    const { pokedex_id } = req.params; // Assuming the ID is passed as a route parameter
    const userId = req.body.userId; // Assuming user ID is passed in the request body

    const status = await pokemonStatus.findOneAndDelete({ pokedex_id, user: userId });

    if (!status) {
      return res.status(404).json({ message: "Pokemon status not found." });
    }

    res.status(200).json({ message: "Pokemon status deleted successfully." });
  } catch (err) {
    console.error(`Unable to delete Pokemon status: ${err}`);
    res.status(500).json({ err });
  }
};

