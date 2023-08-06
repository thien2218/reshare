import { z } from "zod";

const SearchSchema = z.string().nonempty();
const PageSchema = z.number().int().positive();
const LimitSchema = PageSchema;

export const UserQuerySchema = z.object({
   search: SearchSchema,
   page: PageSchema,
   limit: LimitSchema.min(10).max(40).default(20)
});

export const SearchQuerySchema = z.object({
   search: SearchSchema,
   page: PageSchema,
   limit: LimitSchema.min(20).max(60).default(40),
   author: z.string().optional(),
   tags: z.array(z.string()).optional(),
   orderBy: z.string().default("newest")
});

export const TagsQuerySchema = z.object({
   search: SearchSchema,
   limit: LimitSchema.min(50).default(100)
});

export const CommentQuerySchema = z.object({
   page: PageSchema,
   limit: LimitSchema.min(50).default(100)
});
