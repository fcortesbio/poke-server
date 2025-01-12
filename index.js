const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();

const {
  getRouteNumber,
  scheduleRouteCheck,
} = require("./utils/getMapRouteNumber"); // Import both functions
const userRouter = require("./routes/userRouter");
const { validateEnv } = require("./validators/validation");

// -- Middleware --
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 }));
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Global variable to store the current route number
let currentRoute = getRouteNumber();

// -- Public Routes --
app.get("/health", (req, res) => res.status(200).json({ status: "UP" })); // expose route to server health
app.get("/map", (req, res) => res.status(200).json({ mapRoute: currentRoute })); // expose route to check current

// -- User-tied route handlers --
app.use("/", userRouter); // connection with userRouter

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

// -- Start the Server --
async function startServer() {
  validateEnv(); // This will validate process.env and exit if there are errors
  await connectToDatabase();

  // Get the validated PORT from the environment variables
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(`Server listening on: http://127.0.0.1:${port}`);
    scheduleRouteCheck(currentRoute); // Pass currentRoute to scheduleRouteCheck
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
