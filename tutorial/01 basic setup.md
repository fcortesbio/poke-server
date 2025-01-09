# Express Server Setup Tutorial

## Introduction

This guide will walk you through setting up a basic web server using Node.js and Express.js. You'll create a project that follows the MVC (Model-View-Controller) architecture and learn how to configure environment variables, handle routes, and manage errors. We'll be also commiting our project to a fresh GitHub repository and

## Prerequisites

Before you begin, make sure you have the following:

* **Basic JavaScript and Node.js knowledge:** You should be comfortable with JavaScript fundamentals and have a basic understanding of how Node.js works. If you need a refresher, check out this resource: [Eloquent JavaScript](https://eloquentjavascript.net/).

* **Understanding of HTTP methods:** Familiarity with common HTTP request methods (GET, POST, PUT, DELETE) is essential. You can learn more about them here: [MDN HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

* **Node.js, npm and nvm:** Ensure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from the official website: [Node.js downloads](https://nodejs.org/en/download).

* **Git and GitHub:**  You'll need some basic knowledge of Git for version control and GitHub to host your project's code. Install Git and the GitHub CLI, and make sure you have a GitHub account. Here's a guide to get started: [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

* **MongoDB and Atlas:** Basic knowledge of MongoDB is recommended. You'll also need a MongoDB database and its connection URI.  Consider using MongoDB Atlas to create a free database: [MongoDB Atlas](https://www.mongodb.com/atlas/database).

## The Model-View-Controller pattern

This project adheres to [the **MVC** pattern](https://www.interviewbit.com/blog/mvc-architecture/), which stands for ***Model, View, Controller***. MVC is a popular software design pattern for web applications that helps us organize our code and make it easier to build and maintain complex applications. It is essentially a way to separate the different concerns of our application into three interconnected parts that we'll see in brief.

### MVC pattern components

* **1. Model**

Representing our data and the business logic that determines how that data is accessed and modified. It's the "brain" of our application, handling things like database interactions, data validation, and business rules. For example, in a web store, the model would be responsible for managing product information (product name, price, description ...), customer data, and the logic for processing orders.

* **2. View**

A View is what the user sees and interacts with. It's responsible for presenting data in a user-friendly format. The View receives data from the Controller and renders it for the user,  allowing them to visualize and interact with the information. In our web store example, the view would be the web pages that display products, shopping carts, and customer account information.

* **3. Controller**

A Controller connects and works in between of our Model and our Views. It handles user input, updates the model, and selects the appropriate view to render. It's the "traffic cop" of your application. In a webstore, the controller would handle actions like adding items to a cart, submitting an order, or updating customer information. It would then update the model accordingly and display the appropriate view to the user.

![graphic illustrating MVC components](https://www.interviewbit.com/blog/wp-content/uploads/2022/05/Working-of-MVC-768x514.png)

This image from [InterviewBit](https://www.interviewbit.com/blog/mvc-architecture/) illustrates the basic data flow that takes place in MVC Architecture..

### Benefits of a Model-View-Controller architecture

* **Clear separation of concerns**: Makes your code more organized, easier to understand, and less prone to errors.

* **Easier maintenance**: Changes to one part of the application are less likely to affect other parts.

* **Code reusability**: You can reuse models and views in different parts of your application.

* **Faster development and improved testability**: Different developers can work on developing and testing different parts of the application simultaneously.

## Setting up our project structure

To get started, We'll create a git repository to keep track of changes in our project, and define a directory structure based on the MVC pattern. A few additional components will be included, we'll see soon what each one is for:

### 1. Create and sync a the Git repository

Version control is essential for managing a project's codebase, tracking changes, and collaborating with others. We'll use Git and GitHub to set up a repository for our project.

* **1. Open the terminal and navigate to the project directory**

Use the [`cd` command](https://dev.to/ccoveille/tips-the-power-of-cd-command-16b) to navigate to location where the project will be stored.

    ```bash
    cd /path/to/projects/
    ```

* **2. Log in to GitHub using the GitHub CLI**

Use the following command to start the interactive set up and login into your DailyPay account.
(If you don't have the GitHub CLI installed, you can download it from [https://cli.github.com/](https://cli.github.com/).)

    ```bash
    gh auth login
    ```

* **3. Create a new GitHub repository**

Once you're logged in, run the following command:

    ```bash
    gh repo create <repository-name> --public 
    ```
Replace `<repository-name>` with the desired name for your repository. Use the --private option if you want to create a private repository.

Your output should look like this:

    ```bash
    ✓ Created repository username/repository-name on GitHub
    https://github.com/username/repository-name
    ```

* **4. Initialize a local Git Repository**

Run the following command:

    ```bash
    git init poke-server
    ```
This has a couple of effects that are worth mentioning:

    * Creates a directory within your current directory, called `poke-server` (or the directory name chosen) 
    * Creates the  hidden `.git` directory inside `poke-server`, which stores all the metadata used by Git for tracking changes in your local repository
    * Starts tracking changes, from this point, Git will keep a record of any additions, deletions, or modifications you make in this directory.
    * Enables version control through the Git functions

After running the command, you should expect an output like this:

    ```bash
    Initialized empty Git repository in /path/to/projects/poke-server/.git/
    ```

We'll continue working in the main repository folder, use the cd command again to enter this directory:

    ``` bash
    cd poke-server
    ```

The moment is good to briefly introduce the `ls` command, a tool available in Linux command line interfaces. It stands for *list*, and is used to list the contents of directories.

While the macOS has a built-in `ls` command, essentially performing the same functionality, the traditional Windows Command prompt (cmd) doesn't include `ls`. Instead, it uses `dir` to list directory contents. However, Windows PowerShell (a more modern command-line shell) *does* support `ls` as an alias for `dir`, so you can use it there.

`ls`/`dir` commands will list by default all visible files containted in our current directory. Try running the command `ls`. The command is execured, but there's not an output, since the only existing subdirectory, `.git`, is hidden; we need to add an extra argument to our command, in order to list hidden directories and files as well.

For Linux, macOS, and Windows PowerShell, run:

    ```bash
    ls -la
    ```
If using the Windows cmd, you can run with essentially the same functionality:

    ```bash
    dir /a /l
    ```
Now you should see, the `.git` in the list of elements.

* **5. Set the default branch to "main"**:

Imagine your project's history as a timeline.  Every time you save a change, it's like taking a snapshot of your project at that moment in time.

Now, imagine you can create parallel timelines where you can experiment with different ideas without affecting the main timeline. These parallel timelines are called **branches**. In Git, a **branch** is essentially a lightweight pointer to a specific milestone (*commit*) in your project's history.

Run the following command:

    ```bash
    git branch -M main
    ```
This will create our "main" branch, which will store the basic structure of our project. Later on, we'll be creating our first commit to this "main" branch, and in future tutorials, we'll learn how to create 'alternate' to work on specific features of our project, and when and how to merge them into our "main" branch.

For now, run this command to check the current status of your git repository:

    ```bash
    git status
    ```
Our expected output is:

    ```bash
    On branch main

    No commits yet

    nothing to commit (create/copy files and use "git add" to track)
    ```
There's only one step left before we can start building our code.

* **6. Connect your local repository to the remote repository on GitHub**

The structure we've created so far is known as a **local repository** since it lives only in our local machine. However, Git repositories can also be hosted in some other places, such as cloud servers (*e.g*., GitHub, GitLab or Bitbucket). We refer to them as **remote repositories**. We've created a remote repository earlier in our tutorial, now we need to connect our local repository to it.

The properties and configurations of a remote repository can be accessed via the `git remote` command, which has a number of different useful properties:

    * we can add more than one remote using the same syntax: `git remote add <name> <url>`

    * the command `git remote` alone will list the names of all remotes available
    
    * a remote can also be renamed by running: `git remote rename <old-name> <new-name>`
    
    * to view the URLs of these remotes, run: `git remote -v`
    
    * existing remote URLs can also be modified with:  
    
    * to disconnect our local repository from a remote, use: `git remote remove <name>`

Git provides an default remote pointer, called "origin"; it's currently empty, we will assign an url to this pointer by running:  

    ```bash
    git remote add origin https://github.com/username/repository-name
    ```
(Replace your username and the name of the remote repository created in [step 3](url#Line))

We're all set with our git repository. Now we're ready to start building our project code!

### 2. Basic project structure and configuration

* **Create folders with `mkdir`**

Command `mkdir` allows creating one or more new directories inside your current directory. The `-p` option ensures these directories are created only if they don't exist already.

Run the following command in your terminal:

    ```bash
    mkdir -p controllers routes models services 
    ```
This command will create the following directory structure:

    ```bash
        ├── controllers
        ├── routes
        ├── models
        ├── services
        └── utils
    ```
Here's a summary of what each directory should contain:

* **`controllers`**: This directory will contain the controller files, which handle user input and update the model.

* **`routes`**: This directory will contain the route files, which define the endpoints of our API and map them to controller functions.

* **`models`**: This directory will contain the model files, which define the structure and behavior of our data.

* **`services`**: This directory will contain service files, which encapsulate business logic and data access operations. This adds another layer of abstraction and keeps our controllers lean.

* **`utils`**: This directory is for utility functions and helpers that can be reused across our application, reducing code duplication.

Use the `ls` or `dir` command to confirm that you have the correct structure in place.

Existing directories can be removed with the `rmdir` command, *e.g.*:

    ```bash
    mkdir unwanted # create a new 'unwanted directory'
    rmdir unwanted # delete the 'unwanted' directory
    ```

* **Create initial files with `touch`**

Let's start building our initial application files!

The `touch` command is a quick way to create empty files through our terminal.
Run the following command to create the initial files for our project:

    ```bash
    touch README.md .env .gitignore index.js
    ```
Here's a brief summary of what we'll use these files for:

* `README.md`: A documentation file that provides information about the project, including how to set it up, how to use it, and a general overview of its functionality. It often includes sections for installation, usage examples, and contributing guidelines.

* `.env`: This file stores environment variables, such as API keys and database credentials, that should be kept private. Using a `.env` file helps to secure sensitive information and makes it easier to manage different configurations.

* `.gitignore`: This file indicates Git which files or directories should be ignored and not included in version control. This is often used for files containing sensitive information (like our `.env`), temporary files, or dependencies.

* `index.js`: This will be main entry point of our application. This file is responsible for initializing the application, setting up the server, and connecting the different MVC components.

Run the `ls`/`dir` command to ensure our directories and folders have been created.

The following output is expected:

    ```bash
    controllers  index.js  models  README.md  routes  services  utils
    ```

### 3. Node.js dependencies and project initialization

* **Check Node.js installation**

It suits to ensure you we a recent version Node.js installed in our local machine.

Run:

    ```bash
    node --version
    ```
If you have `nvm` you can install (recommended) the **Latest Lont-Term Support (LTS)** version (current: v22.13.0);

Run the following command:

    ```bash
    nvm install --lts
    ```
This installs the most recent Long-Term Support version of Node.js, which generally prioritizes stability and extended support.

* **Install the necessary Node packages**:

Here's a list of the modules we'll be using. We'll see in detail what each one is used for in following sections.

* [`express`](https://expressjs.com/)
* [`dotenv`](https://www.npmjs.com/package/dotenv)
* [`mongoose`](https://mongoosejs.com/docs/guide.html)
* [`morgan`](https://www.npmjs.com/package/morgan)
* [`helmet`](https://www.npmjs.com/package/helmet)
* [`cors`](https://www.npmjs.com/package/cors)
* [`nodemon`](https://www.npmjs.com/package/nodemon)

Run the following command lines in your terminal:

    ```bash
    npm install express dotenv mongoose morgan helmet cors
    npm install --save-dev nodemon 
    ```
This will generate the /node_modules/ folder in your proyect, which will contain the dependencies needed for the project to work

Once our modules are installed, let's initilize our project project:

    ```bash
    npm init -y
    ```
Here's what the command does:

    * `npm init`: This is the standard command for initializing a new Node.js project and creating a package.json file. This file is essential for managing your project's metadata, dependencies, and scripts.

    * `-y` (or `--yes`): This flag tells npm to automatically accept all the default values for the prompts that npm init usually asks (like package name, version, description, etc.).

### 4. Create a MongoDB database

Follow along with these steps to create our first MongoDB data base using the Mongo DB Atlas user interface:

* **1. Sign Up/Log In to MongoDB Atlas**

  * Go to the MongoDB Atlas website: [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)
  * If you don't have an account, sign up for a free one. Otherwise, log in to your existing account.

* **2. Create a New Project**

  * Once logged in, you'll be prompted to create a new project. Give your project a meaningful name.
  * You might be asked about your experience level - choose the option that best suits you.

* **3. Build a Cluster**
  * Click the **"Build a Database"** button.
  * **Choose a cluster tier:**
  * Start with the **Free - M0** tier for learning and small projects.
  * If you need more resources later, you can easily upgrade.
  * **Select a cloud provider and region:**
  * Choose a provider (AWS, Google Cloud, Azure) and a region that's geographically close to you or your users for optimal performance.
  * **Click "Create"**:  This will start the process of creating your cluster. It might take a few minutes for the cluster to be provisioned.

* **4. Set Up Database Access**

  * Once your cluster is ready, navigate to **Security** -> **Database Access**.
  * Click **"Add New User"**.
  * Create a new user with a strong password and appropriate permissions.
  * For learning, you can give the user "Atlas Admin" privileges. For production, follow the principle of least privilege and grant only the necessary permissions.

* **5. Network Access**

  * Go to **Security** -> **Network Access**.
  * Click **"Add IP Address"**.
  * For now, add your current IP address to allow access to your database from your local machine.
  * In a production environment, you'll want to configure more secure access control rules.

* **6. Get the Connection String**

  * Go to **Clusters** -> **Connect**.
  * Choose **"Connect your application"**.
  * Select your preferred driver version (e.g., Node.js).
  * **Copy and save the provided connection string.**  This string contains all the information needed to connect to your database, including the username, password, and cluster address.

#### **Important Notes:**

* **Security:**  In a real-world application, **never hardcode your connection string directly in your code**. Instead, use environment variables to store sensitive information like database credentials.

* **Replace `<password>`:** In the connection string, you'll see `<password>`. Make sure to replace this with the actual password you created for your database user.

* **Database and Collections:** You now have a running MongoDB database! You can create databases and collections directly through the Atlas UI or using the MongoDB shell.

That's it! We've successfully created our MongoDB database using Atlas and obtained the connection string. Now we can use this string to connect to our database from our application.

### 5. Environment Variables, and .gitignore

If you're working with VS Code as your IDE, you can use the command to open the working directory:

    ```bash
    code .
    ```

Open `.env`:

    ```bash
    code .env
    ```

Add our initial environment variables to `.env` and save:

    ```plaintext
    PORT=3000
    MDB_URI="your-mongodb-connection-string"
    ```

Open `.gitignore`*

    ```bash
    code .gitignore
    ```

Add the node modules folder, and `.env` to `.gitignore`:

    ```plaintext
    /node_modules/
    .env
    ```

### 6. Create the Express Server

* **Import required modules**

Our `index.js` file will be the main entry point of our **Express.js** application.

<!--   to-do    -->

Web development often involves repetitive tasks and functionalities that many projects share. Instead of writing the same code from scratch every time, we can use modules, which are like pre-built blocks of code designed for specific purposes. This saves us time and effort, allowing us to focus on the unique aspects of our application.

Think of it like building with LEGOs. You don't need to create every single brick yourself; you can use existing bricks to build something new and awesome!

In this step, we'll import our main modules to help us create our server (remember to check the documentation of each module if you have doubts on how each one works):

Open `index.js`:

    ```bash
    code index.js
    ```

We'll start building our server logic here. Let's start with importing our dependencies:

    ```JavaScript
    const express = require('express');
    const mongoose = require('mongoose');
    const helmet = require('helmet');
    const morgan = require('morgan');
    require('dotenv').config();
    ```

Here's a quick explanation of each module:

**`express`**: This is the core framework we'll use to build our web server and API. It provides tools for routing, handling requests and responses, and much more.

**`mongoose`**: This module helps us interact with our MongoDB database. It makes it easier to work with data in our application.

**`helmet`**: This module enhances the security of our server by setting various HTTP headers.

**`morgan`**: This module provides request logging, which is useful for debugging and monitoring our server.

**`dotenv`**: This module allows us to load environment variables from a `.env` file, which is useful for storing sensitive information like API keys.

By using these modules, we avoid reinventing the wheel and build our server more efficiently.

Note: Adding links to the official documentation for each module would be a helpful addition here.

#### Configure the App

    ```JavaScript
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set('port', PORT);
    ```

#### Apply Middleware

Imagine you're building a house. You have the foundation (your operating system), and you have the rooms and furniture (your application). Middleware is like the plumbing, electrical wiring, and HVAC systems that connect everything and make the house functional.

In more technical terms, middleware is software that sits between an operating system and the applications running on it. It acts as a hidden translation layer, enabling communication and data management for distributed applications.

In Express.js, `app.use()` is a fundamental method for incorporating middleware functions into our application's request-response cycle. Middleware functions have access to the request object (req), the response object (res), and the next function, allowing them to perform tasks like:

    ```JavaScript
    // Security and logging
    app.use(helmet());
    app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 })); // Check the morgan documentation for more loggin options
    app.use(express.json());
    ```
This code snippet applies three important middleware functions to our Express.js application:

**1. `helmet()`**

* **Purpose:**  Enhances the security of our application by setting HTTP headers. These headers help protect against common web vulnerabilities like [cross-site scripting (XSS)](https://owasp.org/www-community/attacks/xss/), [clickjacking](https://owasp.org/www-community/attacks/Clickjacking), and other attacks.

* **How it works:**  Helmet is essentially a collection of smaller middleware functions that each set specific *security-related headers*. Some of the key headers it sets include:

  * **Content-Security-Policy:**  Controls the resources the browser is allowed to load, reducing the risk of XSS attacks.
  * **X-Frame-Options:**  Prevents clickjacking by controlling whether the page can be loaded in a frame.
  * **Strict-Transport-Security (HSTS):**  Forces the browser to use HTTPS, preventing man-in-the-middle attacks.
  * **X-XSS-Protection:**  Enables the browser's built-in XSS filtering.
  * **X-Content-Type-Options:**  Prevents MIME sniffing, which can lead to security issues.

**2. `morgan('combined', { skip: (req, res) => res.statusCode < 400 })`**

* **Purpose:**  Logs HTTP requests to the console, providing valuable information for debugging and monitoring your application.

* **How it works:**
  * `morgan('combined')`:  This uses the "combined" format for logging, which includes details like the request method, URL, status code, response time, and more. You can explore other formats like 'tiny', 'short', 'dev' in the morgan documentation.
  * `{ skip: (req, res) => res.statusCode < 400 }`:  This option configures morgan to skip logging successful requests (status codes below 400). This can help reduce noise in your logs and focus on potential errors or issues.

**3. `express.json()`**

* **Purpose:**  Parses incoming requests with JSON payloads and makes the parsed data available in the `req.body` object.

* **How it works:** This middleware is essential for handling data sent in requests from clients. It automatically parses the JSON data and populates `req.body` so we can easily access it in our route handlers.

By using these middleware functions, we add important security measures, logging capabilities, and JSON parsing to yourour Express application, making it more robust and easier to develop and maintain.

#### Define our Home route in Routes

    ```JavaScript
    app.get('/', (req, res) => {
      res.send('Hello, World!');
      console.log('Successfully reached Home');
    });
    ```

#### Error Handling

    ```JavaScript
    // 404 handler
    app.use((req, res, next) => {
      res.status(404).send('Resource not found');
    });

    // Generic error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
    ```

#### Connect to MongoDB

    ```JavaScript
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log('Connected to MongoDB cluster'))
      .catch((err) => console.error('MongoDB connection failed:', err));
    ```

#### Start the Server

    ```JavaScript
    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
    ```

### 8. Run the Server

Use nodemon to start the server and watch for changes:

    ```bash
    nodemon --watch src index.js
    ```
The expected output should be something like this:

    ```bash
    [nodemon] 3.1.9
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): src
    [nodemon] watching extensions: js,mjs,cjs,json
    [nodemon] starting `node index.js`
    Server listening on port: 4000
    Connected to MongoDB cluster
    ```

### 9. Test the home route

There's a few ways in which routes can be tested.

## Conclusion

You've successfully set up a basic web server using Express.js. You can now build upon this foundation by adding more routes, models, and controllers to handle various features and functionalities.
