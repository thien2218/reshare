import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const user = sqliteTable("users", {
   id: text("id").primaryKey(),
   username: text("username").notNull(),
   name: text("name").notNull(),
   email: text("email").notNull(),
   encryptedPassword: text("encrypted_password"),
   emailVerified: integer("email_verified", { mode: "boolean" }),
   photoUrl: text("photo_url"),
   bio: text("bio")
});

export const insertUserSchema = createInsertSchema(user, {
   username: z.string().max(50),
   name: z.string().max(50),
   email: z.string().email(),
   photoUrl: z.string().url(),
   bio: z.string().max(500)
});

export type InsertUserType = z.infer<typeof insertUserSchema>;

export const selectUserSchema = createSelectSchema(user).omit({
   encryptedPassword: true
});

export type SelectUserType = z.infer<typeof selectUserSchema>;
