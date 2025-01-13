const pokedexEntry = require("../models/pokedexSch");

// Export test response to controllers;
exports.test = (req, res) => {
  res.status(200).send("Hello, Controller!");
  console.log("Successfully accessed Controllers");
};

// Export controller for creating a new pokedexEntry (CREATE)
exports.newPokedexEntry = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have userId in the session
    const pokedexId = req.body.pokedex_id; // Get the pokedex_id from the request body

    // Create a new pokedex entry
    const newEntry = new pokedexEntry({
      pokedex_id: pokedexId,
      user: userId,
    });

    // Save the entry to the database
    await newEntry.save();
    res.status(201).json({ message: "New Pokedex entry created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Pokedex entry" });
  }
};

exports.updatePokedexEntry = async (req, res) => {
  try {
    const userId = req.session.userId;
    const pokedexId = req.params.pokedex_id;
    const { isCatch, gender, isShiny } = req.body;

    // Build the update object based on the request body
    const updateData = {
      $inc: { "encounters.counter": 1 }, // Use $inc for numeric fields
    };
    if (isCatch) {
      updateData.$inc["catches.counter"] = 1; 
      updateData.$set = { // Use $set for boolean fields
        [`catches.${gender}_${isShiny ? "shiny" : "normal"}`]: true,
        [`encounters.${gender}_${isShiny ? "shiny" : "normal"}`]: true,
      };
    } else {
      updateData.$set = { // Use $set for boolean fields
        [`encounters.${gender}_${isShiny ? "shiny" : "normal"}`]: true,
      }
    }

    // Find and update the Pokedex entry
    const updatedEntry = await pokedexEntry.findOneAndUpdate(
      { pokedex_id: pokedexId, user: userId },
      updateData, 
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Pokedex entry not found" });
    }

    res.json({ message: "Pokedex entry updated", entry: updatedEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Pokedex entry" });
  }
};


exports.getPokedexEntry = async (req, res) => {
  try {
    const userId = req.session.userId;
    const pokedexId = req.params.pokedex_id; // Get pokedex_id from route parameters

    // Find the Pokedex entry
    const entry = await pokedexEntry.findOne({
      pokedex_id: pokedexId,
      user: userId,
    });

    if (!entry) {
      return res.status(404).json({ error: "Pokedex entry not found" });
    }

    res.json({ entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Pokedex entry" });
  }
};