import mongoose from "mongoose";
import Like from "../models/like.js";
import Post from "../models/post.js";

export const likePost = async (postId, currentUser) => {
  // starting sessions

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // finding post
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new Error("Post not found");
    }

    // checking existing like
    const existingLike = await Like.findOne({
      user: currentUser.id,
      post: postId,
    }).session(session);
    if (existingLike) {
      throw new Error("User has already liked this post");
    }
    // creating like
    const like = new Like({
      user: currentUser.id,
      post: postId,
    });
    await like.save({ session });
    // increamenting likes
    post.likesCount += 1;
    await post.save({ session });

    await session.commitTransaction();

    return {
      message: "Post liked successfully",
      likesCount: post.likesCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const unlikePost = async (postId, currentUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);

    if (!post) {
      throw new Error("No post found");
    }

    const like = await Like.findOne({
      user: currentUser.id,
      post: postId,
    }).session(session);
    if (!like) {
      throw new Error("You have not liked this post");
    }

    await like.deleteOne({ session });

    post.likesCount -= 1;
    await post.save({ session });

    await session.commitTransaction();

    return {
      message: "Like deleted successfully",
      likesCount: post.likesCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
