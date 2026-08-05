# Social Blog API

A simple Node.js and Express REST API for a social blog application.

## Features

- User authentication
- Password hashing
- JWT-based authorization
- Admin and user route protection
- MongoDB connection setup

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT
- bcryptjs

## Project Structure

- `app.js` - app entry point
- `server.js` - server startup
- `src/routes/` - API routes
- `src/controllers/` - request handlers
- `src/services/` - business logic
- `src/models/` - database models
- `src/middlewares/` - auth and validation middleware

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
MAILTRAP_FROM_EMAIL=no-reply@yourdomain.com
MAILTRAP_FROM_NAME=Social Blog
```

Use your Mailtrap inbox credentials and a sender address that matches your configured domain.

## Run the Application

```bash
npm start
```

The server will start on the port specified in your `.env` file.

## Notes

Make sure MongoDB is running and the connection URI is valid before starting the server.

## Rate limiting

- The API now uses a global limiter to throttle repeated traffic across the whole application.
- Authentication routes such as login and registration use a stricter limiter to reduce brute-force attempts.
- The limits are configurable with environment variables:
  - RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX for the global limiter
  - AUTH_RATE_LIMIT_WINDOW_MS and AUTH_RATE_LIMIT_MAX for auth-specific throttling
