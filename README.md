# Social Blog API

A production-oriented RESTful social blogging API built with **Node.js, Express, MongoDB, Redis, and BullMQ**.

The project implements authentication, authorization, social interactions, background email processing, caching, file uploads, API documentation, automated integration testing, and cloud deployment.

## 🚀 Live API

**API:** https://social-blog-api-a4oz.onrender.com

**Swagger Documentation:** https://social-blog-api-a4oz.onrender.com/api-docs

> The API may take a short time to respond if the hosting service has spun the instance down.

---

## ✨ Features

### Authentication & Authorization

* User registration and login
* Password hashing with bcrypt
* JWT access tokens
* Refresh tokens
* Token-based authentication
* Protected routes
* Role-based access control
* Ownership authorization
* Secure logout
<!-- README fix: email verification is only set up as an OTP email sent on registration; there is no verify endpoint yet -->
* Email verification OTP (verification code emailed on registration)
<!-- README fix: removed "Password reset flow" - it is not implemented in the codebase -->


### Posts

* Create posts
* Read posts
* Update posts
* Delete posts
* Owner-based authorization
* Admin authorization

### Social Features

* Like/unlike posts
* Comments
* Follow/unfollow users
<!-- README fix: there is no profile view/edit endpoint; the only profile-related feature is the profile image upload -->
* Profile image upload

### Performance & Background Processing

* Redis caching
* BullMQ background jobs
* Asynchronous email processing
* Retry handling for failed jobs
* Exponential backoff for failed jobs

### File Handling

* Image/file uploads
* Cloudinary integration
* Multipart form handling with Multer

### Security & Reliability

* Request rate limiting
* Input validation with Zod
* Centralized error handling
* Password protection
* JWT authentication
* Authorization checks

### Development & Testing

* Docker
* Docker Compose
* Jest
* Supertest
* MongoDB Memory Server
* Integration tests
* Swagger/OpenAPI documentation

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      Client         │
                         │  Swagger / Frontend │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Express API     │
                         │      Node.js         │
                         └──────┬──────┬───────┘
                                │      │
                   ┌────────────┘      └──────────────┐
                   ▼                                  ▼
          ┌─────────────────┐                 ┌─────────────────┐
          │  MongoDB Atlas  │                 │   Redis Cloud   │
          │   Persistent DB │                 │ Cache / Queue   │
          └─────────────────┘                 └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   BullMQ Worker │
                                              │   Background    │
                                              │   Email Jobs    │
                                              └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Email Service  │
                                              └─────────────────┘
```

---

# 🛠️ Tech Stack

| Technology              | Purpose                   |
| ----------------------- | ------------------------- |
| Node.js                 | Backend runtime           |
| Express                 | REST API framework        |
| MongoDB                 | Primary database          |
| Mongoose                | MongoDB ODM               |
| JWT                     | Authentication            |
| bcrypt                  | Password hashing          |
| Zod                     | Input validation          |
| Redis                   | Caching and queue storage |
| BullMQ                  | Background job processing |
| Cloudinary              | File/image storage        |
| Multer                  | File uploads              |
<!-- README fix: email is delivered with Nodemailer through Mailtrap (MailerSend is not used in the code) -->
| Nodemailer / Mailtrap  | Email delivery            |
| Swagger                 | API documentation         |
| Jest                    | Testing                   |
| Supertest               | HTTP integration testing  |
| Docker                  | Containerization          |
| Render                  | API and worker deployment |
| MongoDB Atlas           | Cloud database            |
| Redis Cloud             | Cloud Redis               |

---

# 📁 Project Structure

```text
.
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   ├── email.js
│   │   ├── cloudinary.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── queues/
│   │   └── email.queue.js
│   ├── jobs/
│   │   └── email.handlers.js
│   └── workers/
│       ├── email.workers.js
│       └── worker-server.js
│
├── tests/
├── app.js
├── server.js
├── package.json
├── jest.config.js
├── dockerfile
├── docker-compose.yml
└── .env.docker
```

<!-- README fix: structure updated to match the actual repository (added email/cloudinary/swagger config, validators, queues, jobs, worker-server, jest.config; dockerfile is lowercase; there is no .env.example, the Docker env file is .env.docker) -->

---

# 🔐 Authentication Flow

The API uses short-lived access tokens together with refresh tokens.

```text
Login
  │
  ▼
Verify credentials
  │
  ▼
Generate access token
  │
  ├──────────────► Client
  │
  ▼
Generate refresh token
  │
  ▼
Refresh endpoint
  │
  ▼
New access token
```

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

<!-- README fix: login/refresh also set the tokens as HttpOnly cookies, and the middleware accepts either the header or the cookie -->
Both the access and refresh tokens are also delivered as **HttpOnly cookies** on login/refresh, and the auth middleware accepts either the `Authorization` header or the cookie.

---

# 📬 Background Email Processing

Emails are processed asynchronously using BullMQ.

Instead of making the API wait for the email provider:

```text
Request
   │
   ▼
API
   │
   ├── Save user
   │
   └── Add email job
          │
          ▼
      Redis Cloud
          │
          ▼
      BullMQ Worker
          │
          ▼
      Email Provider
```

This keeps the HTTP request fast and allows failed email jobs to be retried.

Jobs use:

* 3 attempts
* Exponential backoff
* Failed-job retention

---

# ⚡ Redis Caching

Frequently accessed data can be cached in Redis to reduce repeated database queries.

The application follows the basic cache-aside pattern:

```text
Request
   │
   ▼
Check Redis
   │
   ├── Cache hit ──► Return cached data
   │
   └── Cache miss
          │
          ▼
       MongoDB
          │
          ▼
      Store in Redis
          │
          ▼
       Return data
```

<!-- README fix: entries are NOT invalidated on writes; they simply expire after a short TTL, and the app keeps running if Redis is down -->
Currently single-post lookups are cached for 5 minutes (`post:<id>` keys) and expire via TTL. Cache entries are **not** invalidated when a post changes. If Redis is unavailable, the app logs a warning and continues serving requests without caching.

---

# 🧪 Testing

The project contains integration tests (Jest + Supertest against an in-memory MongoDB) covering authentication, authorization, posts, likes, follows, profile images, and email configuration.

Authentication & authorization:

* Successful registration
* Duplicate email/username rejection
* Registration validation (missing required fields)
* Password hashing with bcrypt
* Password exclusion from responses
* Verification OTP creation on registration
* Login with valid credentials
* Auth tokens stored in HttpOnly/Secure cookies on login
* Authentication rate limiting (429)
* Unauthorized requests
* Invalid JWT rejection

Posts:

* Post creation (and author population)
* Post validation (missing title/content)
* Post ownership (owner updates/deletes)
* Unauthorized updates/deletes
* Admin post management

Social features:

* Post likes/unlikes (duplicate like, never-liked unlike, missing post)
* Follow/unfollow (duplicate follow, self-follow, not-following, missing user)

Files & configuration:

* Profile image uploads (valid, invalid type, oversized, replacement, unauthorized)
* Email sender configuration

Run tests with:

```bash
npm test
```

---

# 🐳 Running Locally with Docker

### 1. Clone the repository

```bash
git clone https://github.com/ObadoAndres/Social-Blog-API.git
cd node-backend-social-blog-api
```

### 2. Configure your environment file

<!-- README fix: the compose file reads .env.docker directly; there is no .env.example in the repo -->
The Docker Compose setup reads its configuration from `.env.docker`, so edit that file and fill in the required values (MONGO_URI, REDIS_URL, JWT_SECRET, etc.).

### 3. Start the application

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api-docs
```

---

# ⚙️ Environment Variables

<!-- README fix: env example updated to the variables actually read by the code (JWT_SECRET is used for both tokens; email uses Mailtrap; added BCRYPT_SALT_ROUNDS, RATE_LIMIT_*, COOKIE_SECURE) -->
Create a `.env` file containing the required configuration:

```env
NODE_ENV=development
PORT=3000

MONGO_URI=

REDIS_URL=

JWT_SECRET=
BCRYPT_SALT_ROUNDS=12

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=
MAILTRAP_PASS=
MAILTRAP_FROM_EMAIL=socialblog@example.com
MAILTRAP_FROM_NAME=Social Blog

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10

COOKIE_SECURE=false
```

Never commit your `.env` file, `.env.docker`, or production secrets to GitHub (all are listed in `.gitignore`).

---

# 🚀 Deployment

The production application uses:

```text
Express API
      │
      ├── Render
      │
      ├── MongoDB Atlas
      │
      ├── Redis Cloud
      │
      └── BullMQ Worker
              │
              └── Render
```

Environment variables are configured through the hosting platform rather than committed to the repository.

---

# 📖 API Documentation

Interactive API documentation is available through Swagger/OpenAPI:

**https://social-blog-api-a4oz.onrender.com/api-docs**

The documentation allows developers to:

* Explore available endpoints
* View request/response structures
* Authenticate using JWT
* Test protected endpoints
* Test authentication and authorization flows

---

# 🎯 What I Learned

This project was built to go beyond basic CRUD and practice real backend engineering concepts, including:

* Designing REST APIs
* Authentication and authorization
* JWT lifecycle management
* Ownership-based access control
* Database schema design
* MongoDB indexing and querying
* Redis caching
* Asynchronous job processing
* Queue retries and failure handling
* Docker containerization
* API testing
* Cloud deployment
* Production environment configuration
* API documentation

---

# 🔮 Future Improvements

Possible future improvements include:

<!-- README fix: basic page/limit pagination already exists on posts, so the future item is advanced pagination -->
* Advanced pagination (filtering, sorting, cursors)
* Advanced feed recommendations
* More comprehensive automated tests
* Monitoring and structured logging
* CI/CD pipeline
* Improved cache invalidation strategies
* Frontend client
* More granular permissions

---

## 👨‍💻 Author

**Andrew**

Backend-focused IT student interested in building scalable web applications and learning production backend engineering.
