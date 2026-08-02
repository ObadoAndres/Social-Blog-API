import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../app.js";
import User from "../src/models/user.js";

describe("POST /api/register", () => {
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
