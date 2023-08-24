import { z } from "zod";

// Basic schemas
const SearchSchema = z.string().min(3);
const PageSchema = z.number().int().positive();
const LimitSchema = z.number().int().positive();

// Object schemas
export const UserQuerySchema = z
   .object({
      search: SearchSchema,
      page: PageSchema,
      limit: LimitSchema.gte(10).lte(40).default(20)
   })
   .transform((obj) => {
      const { page, ...rest } = obj;
      const offset = (page - 1) * obj.limit;
      return {
         offset,
         ...rest
      };
   });

export const ResourceQuerySchema = z
   .object({
      search: SearchSchema,
      page: PageSchema,
      limit: LimitSchema.gte(20).lte(40).default(20),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      orderBy: z.string().default("newest")
   })
   .transform((obj) => {
      const { page, ...rest } = obj;
      const offset = (page - 1) * obj.limit;
      return {
         offset,
         ...rest
      };
   });

export const TagQuerySchema = z.object({
   search: SearchSchema,
   limit: LimitSchema.gte(10).default(50)
});

export const CommentQuerySchema = z
   .object({
      page: PageSchema,
      limit: LimitSchema.gte(10).default(30)
   })
   .transform((obj) => {
      const { page, ...rest } = obj;
      const offset = (page - 1) * obj.limit;
      return {
         offset,
         ...rest
      };
   });

// Type inferences
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type ResourceQuery = z.infer<typeof ResourceQuerySchema>;
export type TagQuery = z.infer<typeof TagQuerySchema>;
export type CommentQuery = z.infer<typeof CommentQuerySchema>;
