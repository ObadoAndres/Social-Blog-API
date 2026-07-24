import z from "zod"

export const createPostSchema = z.object({
    title : z.string().min(3, {message:"Title must be at least 3 characters long"})
    .max(150, {message:"Title must not be more than 150 characters long"})
    .trim(),

    content : z.string()
    .trim()
    .min(10, {message:"Content must be atleast 10 characters long"})

})