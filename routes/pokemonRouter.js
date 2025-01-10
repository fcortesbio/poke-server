const express = require("express");
const router = express.Router();

// Import the 'test' controller function from the pokemonController
const { test } = require("../controllers/pokemonController"); 

// Define the main API route (GET request to '/')
router.get("/", (req, res) => {
  // Send a "Hello, Router!" response with a 200 (OK) status code
  res.status(200).send("Hello, Router!"); 
  console.log("Successfully reached Routes"); 
});

// Define a route to the 'test' controller function (GET request to '/test')
router.get("/test", test); 

// Export router to be reached by index.js
module.exports = router;