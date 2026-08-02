import User from "../models/user.js";
import { deleteImage, uploadImage } from "./cloudinary.service.js";

export const updateProfileImage = async (userId, file) => {
  if (!file || (!file.buffer && !file.path)) {
    throw new Error("No image file provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.profileImage = user.profileImage || {};
  const oldPublicId = user.profileImage.publicId;

  const buffer = file.buffer || Buffer.from(file.path || "");
  const { secure_url, public_id } = await uploadImage(buffer);

  user.profileImage.url = secure_url;
  user.profileImage.publicId = public_id;
  await user.save();

  if (oldPublicId) {
    try {
      await deleteImage(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old image:", error);
    }
  }

  return user;
};
