const express = require("express");
const router = express.Router();

const {test} = require("../controllers/pokemonController")

router.get("/test", test)

router.get("/", (req, res) => {
  res.send("Hello, Router!").status(200);
  console.log("Succesfully reached pokemonStatus!");
});

module.exports = router;