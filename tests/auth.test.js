import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../app.js";
import User from "../src/models/user.js";
import { resetRateLimitStores } from "../src/middlewares/rateLimit.middleware.js";

describe("POST /api/register", () => {
  beforeEach(() => {
    resetRateLimitStores();
  });
  it("returns 429 when auth rate limits are exceeded", async () => {
    process.env.AUTH_RATE_LIMIT_MAX = "2";
    process.env.AUTH_RATE_LIMIT_WINDOW_MS = "1000";

    const first = await request(app).post("/api/login").send({
      email: "unknown@example.com",
      password: "wrong-password",
    });
    const second = await request(app).post("/api/login").send({
      email: "unknown@example.com",
      password: "wrong-password",
    });
    const third = await request(app).post("/api/login").send({
      email: "unknown@example.com",
      password: "wrong-password",
    });

    expect(first.status).toBeGreaterThanOrEqual(400);
    expect(second.status).toBeGreaterThanOrEqual(400);
    expect(third.status).toBe(429);
  });

  it("registers a new user and returns the expected payload", async () => {
    const res = await request(app).post("/api/register").send({
      username: "Andres",
      email: "andres@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toEqual(
      expect.objectContaining({
        username: "Andres",
        email: "andres@example.com",
      }),
    );
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.email).toEqual(expect.objectContaining({ sent: true }));
  });

  it("stores auth tokens in HttpOnly secure cookies on login", async () => {
    process.env.COOKIE_SECURE = "true";

    const user = await User.create({
      username: "Cookie Tester",
      email: "cookie@example.com",
      password: await bcrypt.hash("password123", 10),
    });

    const res = await request(app).post("/api/login").send({
      email: user.email,
      password: "password123",
    });

    expect(res.status).toBe(200);

    const setCookie = res.headers["set-cookie"] || [];
    expect(setCookie.some((cookie) => cookie.includes("accessToken="))).toBe(true);
    expect(setCookie.some((cookie) => cookie.includes("refreshToken="))).toBe(true);
    expect(setCookie.some((cookie) => cookie.includes("HttpOnly"))).toBe(true);
    expect(setCookie.some((cookie) => cookie.includes("Secure"))).toBe(true);
  });

  it("rejects duplicate email or username", async () => {
    await User.create({
      username: "Test user",
      email: "test@gmail.com",
      password: "123456",
    });

    const res = await request(app).post("/api/register").send({
      username: "Test user2",
      email: "test@gmail.com",
      password: "09345263",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
    expect(await User.countDocuments({ email: "test@gmail.com" })).toBe(1);
  });

  it("rejects registration when required fields are missing", async () => {
    const res = await request(app).post("/api/register").send({
      username: "Test user",
      password: "Pass123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(await User.countDocuments()).toBe(0);
  });

  it("hashes the password before saving", async () => {
    const plainPassword = "Password123";

    const res = await request(app).post("/api/register").send({
      username: "John Doe",
      email: "jayzer@example.com",
      password: plainPassword,
    });

    expect(res.status).toBe(201);

    const user = await User.findOne({ email: "jayzer@example.com" });
    expect(user).not.toBeNull();
    expect(user.password).not.toBe(plainPassword);
    expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
  });
});
