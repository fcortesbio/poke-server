const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  pokemon_id: {
    type: Number,
    required: true,
    unique: true,
  },

  encounter: {
    type: Boolean,
    default: false,
  },

  catch: {
    type: Boolean,
    default: false,
  },

  team_member: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("pokemonStatus", PokemonSchema);
