const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  pokedex_id: {
    type: Number,
    required: true,
    unique: true,
  },

  encounters: {
    male_normal: { type: Number, default: 0 },
    male_shiny: { type: Number, default: 0 },
    female_normal: { type: Number, default: 0 },
    female_shiny: { type: Number, default: 0 },
  },

  catches: {
    male_normal: { type: Number, default: 0 },
    male_shiny: { type: Number, default: 0 },
    female_normal: { type: Number, default: 0 },
    female_shiny: { type: Number, default: 0 },
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
