import Post from "../models/post.js";
import Comment from "../models/comments.js";

export const createComment = async (postId, commentData, currentUser) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("No post found");

  const comment = new Comment({
    author: currentUser.id,
    post: postId,
    content: commentData.content,
  });

  const savedComment = await comment.save();

  post.commentsCount += 1;

  await post.save();

  return savedComment;
};


export const getCommentsByPostId = async (postId)=>{
    const post = await Post.findById(postId)

    if (!post) throw new Error("Post not found");

    const comments = await Comment.find({post: postId})
    .populate("author", "username")
    .sort({createdAt : -1});
  
    return comments

}