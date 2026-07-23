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

- `src/app.js` - app entry point
- `src/server.js` - server startup
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
```

## Run the Application

```bash
npm start
```

The server will start on the port specified in your `.env` file.

## Notes

Make sure MongoDB is running and the connection URI is valid before starting the server.
