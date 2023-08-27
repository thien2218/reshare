import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { posts, resources, users } from "../tables";

// Validation schemas
export const CreatePostSchema = z.object({
   content: z.string().nonempty().max(4000),
   imgAttachments: z.array(z.string().url()).nullable().default(null),
   urlAttachments: z.array(z.string().url()).nullable().default(null),
   scope: z.enum(["public", "followers", "private"]),
   allowComments: z.boolean()
});

export const UpdatePostSchema = CreatePostSchema.partial()
   .omit({ scope: true, allowComments: true })
   .refine((obj) => Object.values(obj).some((val) => val !== undefined), {
      message: "At least one field must be provided"
   });

export const SelectPostSchema = z.object({
   post: createSelectSchema(posts),
   details: createSelectSchema(resources).omit({
      id: true,
      articleId: true,
      postId: true,
      authorId: true
   }),
   author: createSelectSchema(users).omit({
      createdAt: true,
      updatedAt: true,
      encryptedPassword: true,
      provider: true,
      refreshToken: true,
      bio: true
   })
});

// Types
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type SelectPostDto = z.infer<typeof SelectPostSchema>;
