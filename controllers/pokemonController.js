// export test response to controllers; found at: localhost:<port>/<pokemonRouter>/test
exports.test = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully reached Controllers");
};

// import pokemonStatus model
const pokemonStatus = require("../models/pokemonModels");

// export controller for creating a new pokemonStatus
exports.createPokemonStatus = async (req, res) => {
  try {
    // Create a new pokemonStatus document using data from the request body
    const status = await pokemonStatus.create({
      pokemon_id: req.body.pokemon_id,
      encounter: req.body.encounter,
      catch: req.body.catch,
      team_member: req.body.team_member,
    });
    res.status(201).json(status); // Send new pokemonStatus as JSON response
    console.log(
      `Created pokemonStatus for: Pokemon ID: ${req.body.pokemon_id}`
    );
  } catch (err) {
    // Log error message if the pokemonStatus creation fails
    // Send error response with a 500 (Internal Server Error) status code
    console.error(`Unable to create pokemon Status: ${err}`);
    res.status(500).json({ err });
  }
};
