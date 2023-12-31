import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { posts } from "../database/tables";
import { CreateResourceSchema, SelectResourceSchema } from "./resource.schema";

// Validation schemas
const PostSchema = z.object({
   content: z.string().nonempty().max(4000),
   imgAttachments: z.array(z.string().url()).nullable().default(null),
   urlAttachments: z.array(z.string().url()).nullable().default(null)
});

export const CreatePostSchema = PostSchema.extend(CreateResourceSchema.shape);

export const UpdatePostSchema = PostSchema.partial().refine(
   (obj) => Object.values(obj).some((val) => val !== undefined),
   { message: "At least one field must be provided" }
);

export const SelectPostSchema = SelectResourceSchema.extend({
   post: createSelectSchema(posts)
});

// Types
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type SelectPostDto = z.infer<typeof SelectPostSchema>;
