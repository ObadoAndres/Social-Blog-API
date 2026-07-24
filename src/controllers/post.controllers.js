import asyncHandler from "../middlewares/asyncHandler.js";
import { createPost } from "../services/post.service.js";

export const createPostController = asyncHandler(async (req, res) => {
    const postData = req.body;
    const userId = req.user.id;

    const createdPost = await createPost(postData, userId);

    res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: createdPost
    });
});