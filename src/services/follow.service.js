import Follow from "../models/follow.js";
import User from "../models/user.js";

export const followUser = async (targetUserId, currentUser) => {
  if (currentUser.id === targetUserId) {
    throw new Error("You cannot follow yourself");
  }
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  const existingFollow = await Follow.findOne({
    follower: currentUser.id,
    following: targetUserId,
  });

  if (existingFollow) {
    throw new Error("You are already following this user");
  }

  const follow = new Follow({
    follower: currentUser.id,
    following: targetUserId,
  });
  await follow.save();

  currentUser.followingCount += 1;

  targetUser.followersCount += 1;

  await Promise.all([currentUser.save(), targetUser.save()]);

  return {
    message: "User followed successfully",
    following: true,
    followersCount: targetUser.followersCount,
    followingCount: currentUser.followingCount,
  };
};

export const unfollowUser = async (targetUserId, currentUser) => {
  // checking self unfollow
  if (targetUserId === currentUser.id) {
    throw new Error(" You can not unfollow yourself");
  }
  // check if the target user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  // checking if the following relationship exists
  const existingFollow = await Follow.findOne({
    follower: currentUser.id,
    following: targetUserId,
  });

  if (!existingFollow) {
    throw new Error("You have not followed this user");
  }

  //delete follow relationship
  await existingFollow.deleteOne();

  currentUser.followingCount -= 1;

  targetUser.followersCount -= 1;

  await Promise.all([currentUser.save(), targetUser.save()]);

  return {
    message: "User unfollowed successfully",
    following: false,
    followersCount: targetUser.followersCount,
    followingCount: currentUser.followingCount,
  };
};
