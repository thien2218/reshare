import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { resources } from "./resource";

// Table definition
export const users = sqliteTable("users", {
   id: text("id").primaryKey(),
   username: text("username").unique().notNull(),
   email: text("email").unique().notNull(),
   firstName: text("first_name").notNull(),
   lastName: text("last_name").notNull(),
   emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
   provider: text("provider").notNull(),
   refreshToken: text("refresh_token"),
   encryptedPassword: text("encrypted_password"),

   photoUrl: text("photo_url"),
   bio: text("bio"),

   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});

export const userResourceRelation = relations(resources, ({ many }) => ({
   resources: many(resources)
}));
