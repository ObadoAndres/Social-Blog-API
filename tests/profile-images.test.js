import request from "supertest";
import { app } from "../app.js";
import User from "../src/models/user.js";
import generateToken from "../src/utils/generate.token.js";

const buildAuthHeaders = async () => {
  const user = await User.create({
    username: "image-user",
    email: "image-user@example.com",
    password: "password123",
  });

  const token = generateToken({ id: user._id, email: user.email, role: user.role }, "15m");
  return { user, headers: { Authorization: `Bearer ${token}` } };
};

describe("Profile images API", () => {
  it("uploads a profile image", async () => {
    const { headers } = await buildAuthHeaders();

    const res = await request(app)
      .post("/api/users/profile-image")
      .set(headers)
      .attach("image", Buffer.from("fake-image"), { filename: "avatar.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
