import mongoose from "mongoose";
import Follow from "../models/follow.js";
import User from "../models/user.js";

export const followUser = async (targetUserId, currentUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (currentUser.id === targetUserId) {
      throw new Error("You cannot follow yourself");
    }

    const targetUser = await User.findById(targetUserId).session(session);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const existingFollow = await Follow.findOne({
      follower: currentUser.id,
      following: targetUserId,
    }).session(session);

    if (existingFollow) {
      throw new Error("You are already following this user");
    }

    const follow = new Follow({
      follower: currentUser.id,
      following: targetUserId,
    });
    await follow.save({ session });

    currentUser.followingCount += 1;
    targetUser.followersCount += 1;

    await currentUser.save({ session });
    await targetUser.save({ session });
    await session.commitTransaction();

    return {
      message: "User followed successfully",
      following: true,
      followersCount: targetUser.followersCount,
      followingCount: currentUser.followingCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const unfollowUser = async (targetUserId, currentUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (targetUserId === currentUser.id) {
      throw new Error(" You can not unfollow yourself");
    }

    const targetUser = await User.findById(targetUserId).session(session);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const existingFollow = await Follow.findOne({
      follower: currentUser.id,
      following: targetUserId,
    }).session(session);

    if (!existingFollow) {
      throw new Error("You have not followed this user");
    }

    await existingFollow.deleteOne({ session });

    currentUser.followingCount -= 1;
    targetUser.followersCount -= 1;

    await currentUser.save({ session });
    await targetUser.save({ session });
    await session.commitTransaction();

    return {
      message: "User unfollowed successfully",
      following: false,
      followersCount: targetUser.followersCount,
      followingCount: currentUser.followingCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
