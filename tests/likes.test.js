import request from "supertest";
import { app } from "../app.js";
import User from "../src/models/user.js";
import Post from "../src/models/post.js";
import Like from "../src/models/like.js";
import generateToken from "../src/utils/generate.token.js";

const buildAuthHeaders = async () => {
  const user = await User.create({
    username: "like-user",
    email: "like-user@example.com",
    password: "password123",
  });

  const token = generateToken({ id: user._id, email: user.email, role: user.role }, "15m");
  return { user, headers: { Authorization: `Bearer ${token}` } };
};

describe("Likes API", () => {
  it("likes a post", async () => {
    const { user, headers } = await buildAuthHeaders();
    const post = await Post.create({ author: user._id, title: "Like me", content: "Like body" });

    const res = await request(app).post(`/api/like/${post._id}`).set(headers);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.likesCount).toBe(1);
    expect(await Like.countDocuments()).toBe(1);
  });
});
