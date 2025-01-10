const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set("port", PORT);

// -- Middleware --
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400 }));

// -- Routes --
app.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log("Successfully reached Home");
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

startServer();

////// TO-DO list:
// define routes,
// define controllers,
// define model schema,
// implement a graceful shutdown on MongoDB termination signals (e.g. SIGINT, SIGTERM)
// implement configuration validation
// implement login/sign in system
// Enhance error handling ~ error handling middleware could be enhanced to differentiate between operational errors and programming bugs, and potentially log more details or send structured error responses.
// Adding a health check endpoint (e.g., /health) can be useful for monitoring the status of the application.
//  adding rate limiting to protect against DDoS attacks and cors middleware to handle cross-origin requests securely
