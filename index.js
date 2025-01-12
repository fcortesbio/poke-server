const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const getRouteNumber = require("./getMapRouteNumber");
const pokemonRouter = require("./routes/pokemonRouter");
const userRouter = require("./routes/userRouter");
const { validateEnv } = require("./validators/validation");
const app = express();

// -- Middleware --
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 }));
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

// Global variable to store the current route number
let currentRoute = getRouteNumber();

// -- Routes --
app.get("/", (req, res) => res.status(200).send("Hello, World!")); // testing route to Home
app.get("/health", (req, res) => res.status(200).json({ status: "UP" })); // expose route to server health
app.get("/here", (req, res) => res.status(200).json({ mapRoute: currentRoute })); // expose route to check current 

// Route handlers
app.use("/api/pokedex", pokemonRouter); // connection with pokemonRouter
app.use("/api/user", userRouter) // connection with userRouter

// -- Error Handling --
app.use((req, res, next) => {
  res.status(404).send("Ooops! Resource not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ooops! Internal server error");
});

// -- MongoDB connection --
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
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
  validateEnv(); // This will validate process.env and exit if there are errors
  await connectToDatabase(); 

  // Get the validated PORT from the environment variables
  const port = process.env.PORT; 

  app.listen(port, () => {
    console.log(`Server listening on: http://127.0.0.1:${port}`);
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
// console.log(process.env)
startServer();