import asyncHandler from "../middlewares/asyncHandler.js";
import { updateProfileImage } from "../services/user.service.js";

export const uploadProfileImage = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const file = req.file;

  const user = await updateProfileImage(userId, file);

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    data: {
      profileImage: user.profileImage,
      profileImagePublicId: user.profileImage?.publicId || "",
    },
  });
});

