import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { resources } from "./resources";

export const tags = sqliteTable("tags", {
   keyword: text("keyword").primaryKey()
});

export const resourceTags = sqliteTable(
   "resource_tags",
   {
      resourceId: text("resource_id")
         .notNull()
         .references(() => resources.id),
      tagKeyword: text("tag_keyword")
         .notNull()
         .references(() => tags.keyword)
   },
   (table) => {
      return {
         pk: primaryKey(table.resourceId, table.tagKeyword)
      };
   }
);
