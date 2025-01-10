const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const pokemonRouter = require("./routes/pokemonRouter"); // paths 
const getRouteNumber = require("./services/getMapRouteNumber"); // get Kanto map-route numbers

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
  res.status(200).send("Hello, World!");
  console.log("Successfully reached Home.");
});

// pokemonRouter:
app.use("/api/pokemon", pokemonRouter);

// Health check:
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
  console.log(`Successfully checked server health.`);
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
  let currentRoute = getRouteNumber();
  console.log(`Initial route number: ${currentRoute}`);

  const checkAndLogRoute = () => {
    const newRoute = getRouteNumber();
    if (newRoute !== currentRoute) {
      currentRoute = newRoute;
      console.log(`Route changed to: ${currentRoute}`);
    }
  };

  // Check every hour (3600000 ms) and on specific times
  setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours === 0 || hours === 6 || hours === 12 || hours === 18) {
      checkAndLogRoute();
    }
  }, 3600000);
}

// -- Start the Server --
async function startServer() {
  validateConfig(); // Validate environment variables
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
    scheduleRouteCheck(); // Schedule route checks after server starts
  });
}

// -- Graceful Shutdown --
async function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Closing MongoDB connection and shutting down server...`);
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
