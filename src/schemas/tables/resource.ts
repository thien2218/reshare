import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { posts } from "./post";
import { articles } from "./article";
import { relations } from "drizzle-orm";

export const resources = sqliteTable("resources", {
   id: text("id").primaryKey(),
   authorId: text("author_id")
      .references(() => users.id)
      .notNull(),
   articleId: text("article_id")
      .references(() => articles.id)
      .unique(),
   postId: text("post_id")
      .references(() => posts.id)
      .unique(),

   scope: text("scope").notNull(),
   allowComments: integer("allow_comments", { mode: "boolean" }).notNull(),

   likesCount: integer("likes_count").notNull().default(0),
   dislikesCount: integer("dislikes_count").notNull().default(0),
   commentsCount: integer("comments_count").notNull().default(0),

   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});

export const resourceUserRelation = relations(resources, ({ one }) => ({
   author: one(users, {
      fields: [resources.authorId],
      references: [users.id]
   })
}));
