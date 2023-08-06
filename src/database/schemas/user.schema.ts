import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Table definition
const users = sqliteTable("users", {
   id: text("id").primaryKey(),
   username: text("username").notNull(),
   name: text("name").notNull(),
   email: text("email").notNull(),
   encryptedPassword: text("encrypted_password"),
   emailVerified: integer("email_verified", { mode: "boolean" }),
   photoUrl: text("photo_url"),
   bio: text("bio"),
   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});

export default users;

// Validation schemas
export const CreateUserSchema = createInsertSchema(users, {
   username: z.string().nonempty().max(50),
   name: z.string().nonempty().max(50),
   email: z.string().nonempty().email(),
   photoUrl: z.string().url(),
   bio: z.string().max(500)
})
   .omit({ encryptedPassword: true, createdAt: true, updatedAt: true })
   .extend({
      password: z.string().min(6).max(24).optional(),
      confirmPw: z.string().min(6).max(24).optional()
   })
   .refine((value) => value.password && value.password === value.confirmPw, {
      message: "Passwords don't match",
      path: ["confirm"]
   });

export const SelectUserSchema = createSelectSchema(users).omit({
   createdAt: true,
   updatedAt: true,
   encryptedPassword: true
});

export const UpdateUserSchema = SelectUserSchema.partial()
   .omit({
      id: true,
      emailVerified: true
   })
   .refine((obj) => Object.values(obj).some((val) => val !== undefined), {
      message: "At least one property must be present"
   });

// DTOs
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type SelectUserDto = z.infer<typeof SelectUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
