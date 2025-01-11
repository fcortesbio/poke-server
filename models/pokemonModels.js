const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  pokedex_id: {
    type: Number,
    required: true,
    unique: true,
  },

  encounters: {
    normal: { type: Number, default: 0 },
    shiny: { type: Number, default: 0 },
  },

  catches: {
    normal: { type: Number, default: 0 },
    shiny: { type: Number, default: 0 },
  },

  candies: {
    type: Number,
    default: 0,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("PokemonStatus", PokemonSchema);
