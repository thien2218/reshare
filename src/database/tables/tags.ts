import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { resources } from "./resources";

export const tags = sqliteTable("tags", {
   id: text("id").primaryKey(),
   keyword: text("keyword").unique().notNull()
});

export const resourceTags = sqliteTable(
   "resource_tags",
   {
      resourceId: text("resource_id").references(() => resources.id),
      tagId: text("tag_id").references(() => tags.id)
   },
   (table) => {
      return {
         pk: primaryKey(table.resourceId, table.tagId)
      };
   }
);
