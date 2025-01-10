exports.test = ((req, res) => {
    res.status(200).send("Hello, Controller!")
    console.log("Succesfully reached pokemonController!")
})
