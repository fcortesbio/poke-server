const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pokedexEntrySchema = new Schema({
  pokedex_id: {
    type: Number,
    required: true,
    unique: true,
  },

  encounters: {
    male_normal: { type: Boolean, default: false },
    male_shiny: { type: Boolean, default: false },
    female_normal: { type: Boolean, default: false },
    female_shiny: { type: Boolean, default: false },
    counter: { type: Number, default: 0 }
  },

  catches: {
    male_normal: { type: Boolean, default: false },
    male_shiny: { type: Boolean, default: false },
    female_normal: { type: Boolean, default: false },
    female_shiny: { type: Boolean, default: false },
    counter: { type: Number, default: 0 }
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

module.exports = mongoose.model("pokedexEntries", pokedexEntrySchema);