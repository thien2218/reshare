import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { resources } from "./resources";
import { relations } from "drizzle-orm";

// Table definition
export const posts = sqliteTable("posts", {
   id: text("id").primaryKey(),
   content: text("content").notNull(),
   imgAttachments: blob("img_attachments", { mode: "json" }).$type<string[]>(),
   urlAttachments: blob("url_attachments", { mode: "json" }).$type<string[]>()
});

export const postResourceRelation = relations(posts, ({ one }) => ({
   resource: one(resources, {
      fields: [posts.id],
      references: [resources.articleId]
   })
}));
