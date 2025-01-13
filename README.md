# Poke-Server

This is the backend server for a Pokemon-themed application. It provides API endpoints for user authentication, profile management, and Pokedex tracking.

## Features

* User authentication:
  * Sign up with username, email, password, birthday, and country.
  * Log in and log out.
  * Secure password hashing using bcrypt.
  * JWT-based authentication for protected routes.
* User profile management:
  * View and update profile information (email, username, country, password).
  * Delete account.
* Pokedex tracking:
  * Create new Pokedex entries for encountered Pokemon.
  * Update existing entries with catch information (gender, shiny status).
  * Retrieve Pokedex entries.
* Dynamic map route:
  * Simulates Pokemon game map routes based on day of the week and time of day.
* Other features:
  * Helmet middleware for security headers.
  * Morgan middleware for request logging.
  * CORS middleware for cross-origin resource sharing.
  * Rate limiting to prevent abuse.
  * Graceful shutdown handling.

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcrypt
* jsonwebtoken
* Joi
* Helmet
* Morgan
* CORS
* express-rate-limit
* cookie-parser
* express-session

## Getting Started

1. Clone the repository: `git clone https://github.com/your-username/poke-server.git`
2. Install dependencies: `npm install`
3. Configure environment variables (see `.env.example` for a template):
    * `MONGODB_URI`: MongoDB connection string
    * `JWT_SECRET`: Secret key for JWT signing
    * `SESSION_SECRET`: Secret key for session management
    * `PORT`: Port number for the server (default: 3000)
    * `JWT_EXPIRES`: Expiration time for JWT tokens
4. Start the server: `npm run dev` (for development with nodemon) or `npm start` (for production)

## API Endpoints

* `/users`: User-related routes
  * `POST /users/signup`: Register a new user
  * `POST /users/intro`: Check if a username exists
  * `POST /users/login`: Log in
  * `POST /users/logout`: Log out
  * `GET /users/profile`: Get user profile (protected)
  * `PATCH /users/email`: Update email (protected)
  * `PATCH /users/username`: Update username (protected)
  * `PATCH /users/country`: Update country (protected)
  * `PATCH /users/password`: Update password (protected)
  * `DELETE /users/account`: Delete account (protected)
* `/pokedex`: Pokedex-related routes (protected)
  * `POST /pokedex/new`: Create a new Pokedex entry
  * `PATCH /pokedex/:pokedex_id`: Update a Pokedex entry
  * `GET /pokedex/:pokedex_id`: Get a Pokedex entry
* `/map`: Get current map route
* `/`: Check server health

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
