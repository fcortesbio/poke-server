const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Hello, Router!").status(200);
  console.log("Succesfully reached pokemonStatus!");
});

module.exports = router;
