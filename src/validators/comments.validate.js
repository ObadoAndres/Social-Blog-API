import { z } from "zod"

export const commentSchema = z.object({
    content : z
    .string()
    .trim()
    .min(2, {message: "Comment must be at least 2 characters long"})
    .max(500, {message: "Comment must not exceed 500 characters"})
})
