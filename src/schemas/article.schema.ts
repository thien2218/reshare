import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { articles } from "../database/tables";
import { CreateResourceSchema, SelectResourceSchema } from "./resource.schema";

// Validation schemas
const ArticleSchema = z.object({
   title: z.string().nonempty().max(100),
   contentMdUrl: z.string().url(),
   wordCount: z.number().int().positive().min(1000)
});

export const CreateArticleSchema = ArticleSchema.extend(
   CreateResourceSchema.shape
);

export const UpdateArticleSchema = ArticleSchema.partial().refine(
   (obj) => Object.values(obj).some((val) => val !== undefined),
   { message: "At least one property must be present" }
);

export const SelectArticleSchema = SelectResourceSchema.extend({
   article: createSelectSchema(articles)
});

// Types
export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
export type SelectArticleDto = z.infer<typeof SelectArticleSchema>;
