import Follow from "../models/follow.js";
import User from "../models/user.js";

export const followUser = async (targetUserId, currentUser) => {
  if (currentUser.id === targetUserId) {
    const error = new Error("You cannot follow yourself");
    error.statusCode = 400;
    throw error;
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await Follow.findOne({
    follower: currentUser.id,
    following: targetUserId,
  });

  if (existingFollow) {
    const error = new Error("You are already following this user");
    error.statusCode = 409;
    throw error;
  }

  const follow = new Follow({
    follower: currentUser.id,
    following: targetUserId,
  });
  await follow.save();

  const currentUserDoc = await User.findById(currentUser.id);
  currentUserDoc.followingCount += 1;
  targetUser.followersCount += 1;

  await currentUserDoc.save();
  await targetUser.save();

  return {
    message: "User followed successfully",
    following: true,
    follower: { username: currentUserDoc.username },
    following: { username: targetUser.username },
    followersCount: targetUser.followersCount,
    followingCount: currentUserDoc.followingCount,
  };
};

export const unfollowUser = async (targetUserId, currentUser) => {
  if (targetUserId === currentUser.id) {
    const error = new Error("You cannot unfollow yourself");
    error.statusCode = 400;
    throw error;
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await Follow.findOne({
    follower: currentUser.id,
    following: targetUserId,
  });

  if (!existingFollow) {
    const error = new Error("You have not followed this user");
    error.statusCode = 404;
    throw error;
  }

  await existingFollow.deleteOne();

  const currentUserDoc = await User.findById(currentUser.id);
  currentUserDoc.followingCount -= 1;
  targetUser.followersCount -= 1;

  await currentUserDoc.save();
  await targetUser.save();

  return {
    message: "User unfollowed successfully",
    following: false,
    follower: { username: currentUserDoc.username },
    following: { username: targetUser.username },
    followersCount: targetUser.followersCount,
    followingCount: currentUserDoc.followingCount,
  };
};
