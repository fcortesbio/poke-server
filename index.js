const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const pokemonRouter = require("./routes/pokemonRouter");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set("port", PORT);

// -- Middleware --
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 }));
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
  })
);

// -- Routes --
// Home route:
app.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log("Successfully reached Home");
});

// pokemonRouter:
app.use("/api/pokemon", pokemonRouter);

// Health check:
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// -- Error Handling --
app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// -- MongoDB connection --
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB cluster");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

// -- Start the Server --
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

// -- Graceful Shutdown --
async function gracefulShutdown(signal) {
  console.log(
    `Received ${signal}. Closing MongoDB connection and shutting down server...`
  );
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Start the server
startServer();

////// TO-DO list:
// add route to reach createPokemonStatus controller
// implement configuration validation
// implement login/sign in system
// Enhance error handling ~ error handling middleware could be enhanced to differentiate between operational errors and programming bugs, and potentially log more details or send structured error responses.
