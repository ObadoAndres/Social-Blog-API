import Like from "../models/like.js";
import Post from "../models/post.js";

export const likePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const existingLike = await Like.findOne({
    user: currentUser.id,
    post: postId,
  });
  if (existingLike) {
    throw new Error("User has already liked this post");
  }

  const like = new Like({
    user: currentUser.id,
    post: postId,
  });
  await like.save();

  post.likesCount += 1;
  await post.save();

  return {
    message: "Post liked successfully",
    likesCount: post.likesCount,
  };
};

export const unlikePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("No post found");
  }

  const like = await Like.findOne({
    user: currentUser.id,
    post: postId,
  });
  if (!like) {
    throw new Error("You have not liked this post");
  }

  await like.deleteOne();

  post.likesCount -= 1;
  await post.save();

  return {
    message: "Like deleted successfully",
    likesCount: post.likesCount,
  };
};
