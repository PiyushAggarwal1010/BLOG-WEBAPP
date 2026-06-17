const { z } = require("zod");

const postSchema = z.object({
  title: z
    .string({required_error:"Title is required"})
    .min(5, "Title too short")
    .max(100, "Title too long"),

  content: z
    .string({required_error:"Content is required"})
    .min(20, "Content too short")
    .max(5000, "Content too long")
});

module.exports = { postSchema };