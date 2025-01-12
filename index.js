const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path")
require("dotenv").config();

const getRouteNumber = require("./getMapRouteNumber");
const pokemonRouter = require("./routes/pokemonRouter");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set("port", PORT);

// -- Middleware --
app.use(express.urlencoded({ extended: true })) // ?
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 }));
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

// Global variable to store the current route number
let currentRoute = getRouteNumber();

// -- Routes --
app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
  console.log("Successfully reached Home.");
});

// Expose current route via API
app.get("/route", (req, res) => {
  res.status(200).json({ route: currentRoute });
  console.log(`Returned route number: ${currentRoute} to client.`);
});

app.use("/pokedex/entries", pokemonRouter); // connection with Pokedex
app.use("/users/auth") // connection with Auth

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
  console.log("Successfully checked server health.");
});

// -- Error Handling --
app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

function validateConfig() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
}

// -- MongoDB connection --
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB cluster");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

// -- Periodic Map Route check --
function scheduleRouteCheck() {
  console.log(`Current map route number: ${currentRoute}`);

  const checkAndLogRoute = () => {
    const newRoute = getRouteNumber();
    if (newRoute !== currentRoute) {
      currentRoute = newRoute;
      console.log(`Route changed to: ${currentRoute}`);
    }
  };

  setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours === 0 || hours === 6 || hours === 12 || hours === 18) {
      checkAndLogRoute();
    }
  }, 3600000); // Check every hour
}

// -- Start the Server --
async function startServer() {
  validateConfig();
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on: http://127.0.0.1:${PORT}`);
    scheduleRouteCheck();
  });
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
