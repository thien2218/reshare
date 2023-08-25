import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import users from "./user.schema";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

// Table definition
const articles = sqliteTable("articles", {
   id: text("id").primaryKey(),
   authorId: text("author_id")
      .references(() => users.id)
      .notNull(),
   title: text("title").unique().notNull(),
   contentMdUrl: text("content_md_url").notNull(),
   wordCount: integer("word_count").notNull(),

   scope: text("scope").notNull(),
   allowComments: integer("allow_comments", { mode: "boolean" }).notNull(),

   likesCount: integer("likes_count").notNull().default(0),
   dislikesCount: integer("dislikes_count").notNull().default(0),
   commentsCount: integer("comments_count").notNull().default(0),
   averageRating: real("average_rating").notNull().default(0),

   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});

export default articles;

// Validation schemas
export const CreateArticleSchema = z.object({
   title: z.string().nonempty().max(100),
   contentMdUrl: z.string().url(),
   wordCount: z.number().int().positive().min(1000),
   scope: z.enum(["public", "followers", "private"]),
   allowComments: z.boolean()
});

export const UpdateArticleSchema = CreateArticleSchema.partial().refine(
   (obj) => Object.values(obj).some((val) => val !== undefined),
   { message: "At least one property must be present" }
);

export const SelectArticleSchema = createSelectSchema(articles);

// Types
export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
export type SelectArticleDto = z.infer<typeof SelectArticleSchema>;
