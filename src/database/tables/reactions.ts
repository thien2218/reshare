import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const reactions = sqliteTable(
   "reactions",
   {
      userId: text("user_id")
         .references(() => users.id)
         .notNull(),
      reactableId: text("reactable_id").notNull(),
      type: text("type").notNull(),
      reactableType: text("reactable_type").notNull()
   },
   (table) => {
      return {
         pk: primaryKey(table.userId, table.reactableId)
      };
   }
);
