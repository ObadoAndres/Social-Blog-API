import User from "../models/user.js";
import { deleteImage, uploadImage } from "./cloudinary.service.js";

export const updateProfileImage = async (userId, file) => {
  // checking if file exists
  if (!file || !file.buffer) {
    throw new Error("No image file provided");
  }

  //checking if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.profileImage = user.profileImage || {};
  const oldPublicId = user.profileImage.publicId;

  // uploading image
  const { secure_url, public_id } = await uploadImage(file.buffer);

  //update user
  user.profileImage.url = secure_url;
  user.profileImage.publicId = public_id;
  await user.save();

  // deleting old image
  if (oldPublicId) {try {
    await deleteImage(oldPublicId);
} catch (error) {
    console.error("Failed to delete old image:", error);
}
  }

  return user;
};
