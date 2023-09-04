import { createSelectSchema } from "drizzle-zod";
import { resources } from "../database/tables";
import { SelectUserSchema } from "./user.schema";
import { z } from "zod";

// Validation schemas
export const SelectResourceSchema = z.object({
   details: createSelectSchema(resources).omit({
      id: true,
      articleId: true,
      postId: true,
      authorId: true
   }),
   author: SelectUserSchema.omit({
      createdAt: true,
      updatedAt: true,
      bio: true
   })
});

export const CreateResourceSchema = z.object({
   scope: z.enum(["public", "followers", "private"]),
   allowComments: z.boolean()
});

export const UpdateResourceSchema = CreateResourceSchema.partial();

// DTOs
export type UpdateResourceDto = z.infer<typeof UpdateResourceSchema>;
