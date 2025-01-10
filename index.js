const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('port', PORT);

// -- Middleware --
app.use(helmet());
app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));
app.use(express.json());

// -- Routes --
app.get('/', (req, res) => {
  res.send('Hello, World!');
  console.log('Successfully reached Home');
});

// -- Error Handling --
app.use((req, res, next) => {
  res.status(404).send('Resource not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// -- MongoDB connection --
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB cluster');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

// -- Start the Server --
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

startServer();