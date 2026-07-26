import { followUser, unfollowUser } from "../services/follow.service.js";

export const followUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params; // target user ID
  const currentUser = req.user;

  const result = await followUser(userId, currentUser);

  res.status(200).json({
    success: true,
    ...result,
  });
});


export const unfollowUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params; // target user ID
  const currentUser = req.user;

  const result = await unfollowUser(userId, currentUser);

  res.status(200).json({
    success: true,
    ...result,
  });
});