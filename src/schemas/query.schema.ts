import { z } from "zod";

// Basic schemas
const SearchSchema = z.string().min(3);
const OffsetSchema = z.number().int().nonnegative();
const LimitSchema = z.number().int().positive();

// Object schemas
export const UserQuerySchema = z.object({
   search: SearchSchema,
   offset: OffsetSchema,
   limit: LimitSchema.gte(10).lte(40).default(20)
});

export const ResourceQuerySchema = z.object({
   search: SearchSchema,
   offset: OffsetSchema,
   limit: LimitSchema.gte(20).lte(60).default(40),
   author: z.string().optional(),
   tags: z.array(z.string()).optional(),
   orderBy: z.string().default("newest")
});

export const TagQuerySchema = z.object({
   search: SearchSchema,
   limit: LimitSchema.gte(50).default(100)
});

export const CommentQuerySchema = z.object({
   offset: OffsetSchema,
   limit: LimitSchema.gte(50).default(100)
});

// Type inferences
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type ResourceQuery = z.infer<typeof ResourceQuerySchema>;
export type TagQuery = z.infer<typeof TagQuerySchema>;
export type CommentQuery = z.infer<typeof CommentQuerySchema>;
