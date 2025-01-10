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
      // Check if a pokemonStatus with the same pokemon_id already exists
      const existingStatus = await pokemonStatus.findOne({ pokemon_id: req.body.pokemon_id });
      
      if (existingStatus) {
        // If a record is found, return a response indicating the record already exists
        return res.status(409).json({ message: "Pokemon status with this ID already exists." });
      }
  
      // If no record is found, create a new pokemonStatus document
      const status = await pokemonStatus.create({
        pokemon_id: req.body.pokemon_id,
        encounter: req.body.encounter,
        catch: req.body.catch,
        team_member: req.body.team_member,
      });
  
      // Send the new pokemonStatus as a JSON response
      res.status(201).json(status);
      console.log(`Created pokemonStatus for: Pokemon ID: ${req.body.pokemon_id}`);
    } catch (err) {
      // Log error message if the pokemonStatus creation fails
      console.error(`Unable to create pokemon Status: ${err}`);
      res.status(500).json({ err });
    }
  };
  