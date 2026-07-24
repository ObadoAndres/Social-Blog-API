import Post from "../models/post.js"


export const createPost = async(postData, userId) => {
    const post = new Post({
        author: userId, ...postData
    })

    const savedPost = await post.save();

    return savedPost;
}

export const getPosts = async (page = 1, limit =10) => {
    const skip = (page - 1) * limit;

    const posts = await Post.find()
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate("author", "username")
  

    return posts;
}

export const getPostById = async (postId)=>{
    const post = await Post.findById(postId).populate("author", "username");

    if(!post) throw new Error("Post not found");

    return post;
}


export const updatePost = async (postId, updateData, currentUser) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }

    if (
        post.author.toString() !== currentUser.id &&
        currentUser.role !== "admin"
    ) {
        throw new Error("Not authorized to update");
    }

    if (updateData.title !== undefined) {
        post.title = updateData.title;
    }

    if (updateData.content !== undefined) {
        post.content = updateData.content;
    }

    const updatedPost = await post.save();

    return updatedPost;
};