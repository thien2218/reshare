import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import users from "./user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Table definition
const posts = sqliteTable("posts", {
   id: text("id").primaryKey(),
   authorId: text("author_id")
      .references(() => users.id)
      .notNull(),
   content: text("content").notNull(),
   imgAttachments: blob("img_attachments", { mode: "json" }).$type<string[]>(),
   urlAttachments: blob("url_attachments", { mode: "json" }).$type<string[]>(),

   scope: text("scope").notNull(),
   allowComments: integer("allow_comments", { mode: "boolean" }).notNull(),

   likesCount: integer("likes_count").notNull().default(0),
   dislikesCount: integer("dislikes_count").notNull().default(0),
   commentsCount: integer("comments_count").notNull().default(0),

   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});

export default posts;

// Validation schemas
export const CreatePostSchema = createInsertSchema(posts, {
   content: z.string().nonempty().max(4000),
   imgAttachments: z.array(z.string().url()),
   urlAttachments: z.array(z.string().url()),
   scope: z.enum(["public", "followers", "private"])
}).omit({
   id: true,
   authorId: true,
   createdAt: true,
   updatedAt: true,
   likesCount: true,
   dislikesCount: true,
   commentsCount: true
});

export const UpdatePostSchema = CreatePostSchema.partial().refine(
   (obj) => Object.values(obj).some((val) => val !== undefined),
   { message: "At least one field must be provided" }
);

export const SelectPostSchema = createSelectSchema(posts);

// Types
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type SelectPostDto = z.infer<typeof SelectPostSchema>;
