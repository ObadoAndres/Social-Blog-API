import { request } from "express";
import { app } from "../app.js";
import User from "../src/models/user.js";
import bcrypt from "bcrypt";

describe("POST /auth/register", () => {
  it("should register a new user successfully", async () => {
    const userData = {
      username: "Andres",
      email: "andres@example.com",
      password: "password123",
    };
    const res = await request(app).post("/auth/register").send(userData);

    expect(res.status).toBe(201);
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user).toHaveProperty("email");
  });

  it("should reject duplicate email", async () => {
    await User.create({
      username: "Test user",
      email: "test@gmail.com",
      password: "123456",
    });

    const res = await request(app).post("/auth/register").send({
      username: "Test user2",
      email: "test@gmail.com",
      password: "09345263",
    });

    expect(res.status).toBe(400);

    expect(res.body.message).toBe("User already exists");

    const users = await User.find();

    expect(users).toHaveLength(1);

    const count = await User.countDocuments({
      email: "test@gmail.com",
    });

    expect(count).toBe(1);
  });

  it("should reject registration when email is missing", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "Test user",
      password: "Pass123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");

    const users = await User.find();
    expect(users).toHaveLength(0);
  });

  it("should hash password before saving", async () => {
    const plainPassword = "Password123";

    const res = await request(app).post("/auth/register").send({
      username: "John Doe",
      email: "jayzer@example.com",
      password: plainPassword,
    });

    expect(res.status).toBe(201);

    const user = await User.findOne({
      email: "jayzer@example.com",
    });

    expect(user).not.toBeNull();

    expect(user.password).not.toBe(plainPassword);

    expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
  });

  it("should not return password in response", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "Andres",
      email: "Andres@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).toHaveProperty("email", "Andres@example.com");
    expect(res.body.user).toHaveProperty("username", "Andres");
  });
});
