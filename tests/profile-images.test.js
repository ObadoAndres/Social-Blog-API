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
    expect(res.body.data.profileImage).toBeTruthy();
  });

  it("rejects non-image uploads", async () => {
    const { headers } = await buildAuthHeaders();

    const res = await request(app)
      .post("/api/users/profile-image")
      .set(headers)
      .attach("image", Buffer.from("not-an-image"), { filename: "avatar.txt", contentType: "text/plain" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid file type. Only JPEG, PNG, and WEBP are allowed");
  });

  it("rejects oversized image uploads", async () => {
    const { headers } = await buildAuthHeaders();
    const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024, "a");

    const res = await request(app)
      .post("/api/users/profile-image")
      .set(headers)
      .attach("image", oversizedBuffer, { filename: "avatar.png", contentType: "image/png" });

    expect(res.status).toBe(413);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Image size must be less than 5MB");
  });

  it("replaces the old image when uploading a new one", async () => {
    const { user, headers } = await buildAuthHeaders();
    await User.findByIdAndUpdate(user._id, {
      profileImage: { url: "https://old.example.com/old.png", publicId: "old-image-id" },
    });

    const res = await request(app)
      .post("/api/users/profile-image")
      .set(headers)
      .attach("image", Buffer.from("updated-image"), { filename: "avatar.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.profileImage.publicId).not.toBe("old-image-id");
    expect(updatedUser.profileImage.url).toBeTruthy();
  });

  it("rejects an unauthorized upload", async () => {
    const res = await request(app)
      .post("/api/users/profile-image")
      .attach("image", Buffer.from("fake-image"), { filename: "avatar.png", contentType: "image/png" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access token required");
  });
});
