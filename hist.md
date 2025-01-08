# How to set up your first Node.js/Express.js server

## Create GitHub local repository / link remote repository

```bash
gh auth login # complete GitHub login
gh repo create <repository-name> --public

git init <repository-name> # create a local repository 
cd <reposory-location>
git branch -M main

git remote add origin https://github.com/username/repository-name
```

## Create project architecture following the MVC pattern

```bash
mkdir -p controllers routes models services && ls -la | grep "^d"
touch README.md hist.md .env .gitignore index.js
```

## Install Node dependencies

Packages to use:

- [`express`](https://expressjs.com/) (Web framework for Node.js)
- [`dotenv`](https://www.npmjs.com/package/dotenv) (Load envirnonment variables from a `.env` file)
- [`mongoose`](https://mongoosejs.com/docs/guide.html) (MongoDB object modeling (ODM) for Node.js)
- [`morgan`](https://www.npmjs.com/package/morgan) (HTTP request logger middleware)
- [`helmet`](https://www.npmjs.com/package/helmet) (Secure Expres apps by setting HTTP response headers)
- [`cors`](https://www.npmjs.com/package/cors) (Cross-origin Resource Sharing middleware)
- [`nodemon`](https://www.npmjs.com/package/nodemon) (automates server restarting process)

To install these packages, run the snippet:

```bash
npm install express dotenv mongoose morgan helmet cors
npm install --save-dev nodemon # install nodemon as a development dependency
```

## Configure .gitignore

Include the following lines in your `.gitignore` to ignore node_modules and .env files

```plaintext
/node_modules/
.env
```

## Set up environent variables

to-do:

```plaintext
PORT=3000
MONGODB_URI="mongodb+srv://fcortesbio:easy2remember@users.bi1pe.mongodb.net/"
```

## Initialize project

To create the packages list and initialize the Node project, run the command:

```bash
npm init -y
```

## Set up a basic Express Server

```JavaScript
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ?? 3000;
// app.set("port", PORT); // this might not be necessary at all

// --- Routes ---
app.get("/", (req, res) => res.send("Hello, World!"));

// --- Middlewares ---
// -- helpers --
app.use(express.json());


// -- error handling --
app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});




// --- Database connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB cluster!"))
  .catch((err) => console.error("MongoDB connection failed: ", err));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}!`));
```

## Run server

Run the server with nodemon to test connection

```bash
nodemon --watch src index.js
```
