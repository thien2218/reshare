import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { articles } from "../database/tables";
import { SelectUserSchema } from "./user.schema";
import { SelectResourceSchema } from "./resource.schema";

// Validation schemas
export const CreateArticleSchema = z.object({
   title: z.string().nonempty().max(100),
   contentMdUrl: z.string().url(),
   wordCount: z.number().int().positive().min(1000),
   scope: z.enum(["public", "followers", "private"]),
   allowComments: z.boolean()
});

export const UpdateArticleSchema = CreateArticleSchema.partial()
   .omit({ scope: true, allowComments: true })
   .refine((obj) => Object.values(obj).some((val) => val !== undefined), {
      message: "At least one property must be present"
   });

export const SelectArticleSchema = z.object({
   article: createSelectSchema(articles),
   details: SelectResourceSchema,
   author: SelectUserSchema.omit({
      createdAt: true,
      updatedAt: true,
      bio: true
   })
});

// Types
export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
export type SelectArticleDto = z.infer<typeof SelectArticleSchema>;
