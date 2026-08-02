import request from "supertest";
import { app } from "../app.js";
import User from "../src/models/user.js";
import Follow from "../src/models/follow.js";
import generateToken from "../src/utils/generate.token.js";

const buildAuthHeaders = async () => {
  const user = await User.create({
    username: "follow-user",
    email: "follow-user@example.com",
    password: "password123",
  });

  const token = generateToken({ id: user._id, email: user.email, role: user.role }, "15m");
  return { user, headers: { Authorization: `Bearer ${token}` } };
};

describe("Follows API", () => {
  it("follows a user", async () => {
    const { user, headers } = await buildAuthHeaders();
    const target = await User.create({ username: "target-user", email: "target-user@example.com", password: "password123" });

    const res = await request(app).post(`/api/follow/${target._id}`).set(headers);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(await Follow.countDocuments()).toBe(1);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.followingCount).toBe(1);
  });
});
