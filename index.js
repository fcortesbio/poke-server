// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ?? 3000;
app.set('port', PORT);

// --- Middlewares ---
app.use(express.json());
app.use(morgan('combined', {
  skip: function(req, res){
    return res.statusCode < 400
  }}));

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello, World!')
  console.log('Succesfully reached Home')
}); 

// -- error handling --
app.use((req, res, next) => {
  // 404 handler
  res.status(404).send('Resource not found');
});

app.use((err, req, res, next) => {
  // Error handler
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Database connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB cluster'))
  .catch((err) => console.error('MongoDB connection failed: ', err));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
