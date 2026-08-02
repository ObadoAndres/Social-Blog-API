import request from "supertest";
import { app } from "../app.js";
import User from "../src/models/user.js";
import Post from "../src/models/post.js";
import generateToken from "../src/utils/generate.token.js";

const buildAuthHeaders = async (userOverrides = {}) => {
  const user = await User.create({
    username: userOverrides.username || "post-user",
    email: userOverrides.email || "post-user@example.com",
    password: "password123",
    role: userOverrides.role || "user",
  });

  const token = generateToken({ id: user._id, email: user.email, role: user.role }, "15m");
  return { user, headers: { Authorization: `Bearer ${token}` } };
};

describe("Posts API", () => {
  it("creates a post", async () => {
    const { headers } = await buildAuthHeaders();

    const res = await request(app).post("/api/post").set(headers).send({
      title: "Hello world",
      content: "This is a test post body",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Hello world");
    expect(await Post.countDocuments()).toBe(1);
  });

  it("rejects a post with missing title", async () => {
    const { headers } = await buildAuthHeaders();

    const res = await request(app).post("/api/post").set(headers).send({
      content: "This is a test post body",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("rejects a post with missing content", async () => {
    const { headers } = await buildAuthHeaders();

    const res = await request(app).post("/api/post").set(headers).send({
      title: "Hello world",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("requires auth to create a post", async () => {
    const res = await request(app).post("/api/post").send({
      title: "Hello world",
      content: "This is a test post body",
    });

    expect(res.status).toBe(401);
  });

  it("rejects invalid jwt", async () => {
    const res = await request(app).post("/api/post").set("Authorization", "Bearer invalid-token").send({
      title: "Hello world",
      content: "This is a test post body",
    });

    expect(res.status).toBe(401);
  });

  it("allows owner to update a post", async () => {
    const { user, headers } = await buildAuthHeaders();
    const post = await Post.create({ author: user._id, title: "Old", content: "Old content" });

    const res = await request(app).put(`/api/post/${post._id}`).set(headers).send({ title: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated");
  });

  it("rejects unauthorized update", async () => {
    const { headers } = await buildAuthHeaders();
    const otherUser = await User.create({ username: "other-user", email: "other@example.com", password: "password123" });
    const post = await Post.create({ author: otherUser._id, title: "Old", content: "Old content" });

    const res = await request(app).put(`/api/post/${post._id}`).set(headers).send({ title: "Updated" });

    expect(res.status).toBe(403);
  });

  it("allows admin update", async () => {
    const { headers } = await buildAuthHeaders({ role: "admin" });
    const otherUser = await User.create({ username: "other-user-2", email: "other2@example.com", password: "password123" });
    const post = await Post.create({ author: otherUser._id, title: "Old", content: "Old content" });

    const res = await request(app).put(`/api/post/${post._id}`).set(headers).send({ title: "Updated by admin" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated by admin");
  });

  it("allows owner to delete a post", async () => {
    const { user, headers } = await buildAuthHeaders();
    const post = await Post.create({ author: user._id, title: "Delete me", content: "Remove me" });

    const res = await request(app).delete(`/api/post/${post._id}`).set(headers);

    expect(res.status).toBe(200);
    expect(await Post.countDocuments()).toBe(0);
  });

  it("rejects unauthorized delete", async () => {
    const { headers } = await buildAuthHeaders();
    const otherUser = await User.create({ username: "delete-target", email: "delete-target@example.com", password: "password123" });
    const post = await Post.create({ author: otherUser._id, title: "Delete me", content: "Remove me" });

    const res = await request(app).delete(`/api/post/${post._id}`).set(headers);

    expect(res.status).toBe(403);
  });
});
