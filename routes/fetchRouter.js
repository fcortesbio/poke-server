
const express = require('express');
const router = express.Router();
const { fetchPokemonAttributes } = require('../services/fetchGQL'); 

router.get('/', async (req, res) => {
  try {
    const ids = req.query.ids.split(',').map(Number); 
    const pokemonData = await fetchPokemonAttributes(ids);
    res.json(pokemonData);
  } catch (error) {
    console.error("Error in /api/pokemon endpoint:", error); 
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
});

module.exports = router;