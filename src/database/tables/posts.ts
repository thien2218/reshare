import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Table definition
export const posts = sqliteTable("posts", {
   id: text("id").primaryKey(),
   content: text("content").notNull(),
   imgAttachments: blob("img_attachments", { mode: "json" }).$type<string[]>(),
   urlAttachments: blob("url_attachments", { mode: "json" }).$type<string[]>()
});
