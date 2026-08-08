import request from "supertest";
import mongoose from "mongoose";
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
    expect(res.body.follower).toMatchObject({ username: user.username });
    expect(res.body.following).toMatchObject({ username: target.username });
    expect(await Follow.countDocuments()).toBe(1);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.followingCount).toBe(1);
  });

  it("cannot follow twice", async () => {
    const { user, headers } = await buildAuthHeaders();
    const target = await User.create({ username: "target-user-2", email: "target-user-2@example.com", password: "password123" });
    await Follow.create({ follower: user._id, following: target._id });

    const res = await request(app).post(`/api/follow/${target._id}`).set(headers);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("You are already following this user");
    expect(await Follow.countDocuments()).toBe(1);
  });

  it("cannot follow yourself", async () => {
    const { user, headers } = await buildAuthHeaders();

    const res = await request(app).post(`/api/follow/${user._id}`).set(headers);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("You cannot follow yourself");
    expect(await Follow.countDocuments()).toBe(0);
  });

  it("unfollows a user", async () => {
    const { user, headers } = await buildAuthHeaders();
    const target = await User.create({ username: "target-user-3", email: "target-user-3@example.com", password: "password123" });
    await Follow.create({ follower: user._id, following: target._id });

    const res = await request(app).delete(`/api/follow/${target._id}`).set(headers);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.following).toBe(false);
    expect(await Follow.countDocuments()).toBe(0);
  });

  it("cannot unfollow if not following", async () => {
    const { user, headers } = await buildAuthHeaders();
    const target = await User.create({ username: "target-user-4", email: "target-user-4@example.com", password: "password123" });

    const res = await request(app).delete(`/api/follow/${target._id}`).set(headers);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("You have not followed this user");
  });

  it("returns 404 when following a non-existing user", async () => {
    const { headers } = await buildAuthHeaders();
    const missingUserId = new mongoose.Types.ObjectId().toString();

    const res = await request(app).post(`/api/follow/${missingUserId}`).set(headers);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 404 when unfollowing a non-existing user", async () => {
    const { headers } = await buildAuthHeaders();
    const missingUserId = new mongoose.Types.ObjectId().toString();

    const res = await request(app).delete(`/api/follow/${missingUserId}`).set(headers);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});
