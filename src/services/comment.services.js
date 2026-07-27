import mongoose from "mongoose";
import Post from "../models/post.js";
import Comment from "../models/comments.js";

export const createComment = async (postId, commentData, currentUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);

    if (!post) throw new Error("No post found");

    const authorId = currentUser?.id || currentUser;

    const comment = new Comment({
      author: authorId,
      post: postId,
      content: commentData.content,
    });

    const savedComment = await comment.save({ session });

    post.commentsCount += 1;
    await post.save({ session });

    await session.commitTransaction();
    return savedComment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getCommentsByPostId = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  const comments = await Comment.find({ post: postId })
    .populate("author", "username")
    .sort({ createdAt: -1 });

  return comments;
};