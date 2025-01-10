exports.test = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully reached Controllers");
};

const pokemonStatus = require("../models/pokemonModels");

exports.createPokemonStatus = async (req, res) => {
  try {
    const status = await pokemonStatus.create({
      pokemon_id: req.body.pokemon_id,
      encounter: req.body.encounter,
      catch: req.body.catch,
      team_member: req.body.team_member,
    });
    res.status(201).json(status);
    console.log(`Created pokemonStatus for: Pokemon ID: ${req.body.pokemon_id}`);
  } catch (err) {
    console.error(`Unable to create pokemon Status: ${err}`);
    res.status(500).json({ err });
  }
};
