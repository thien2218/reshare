import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Table definition
const users = sqliteTable("users", {
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

export default users;

// Validation schemas
export const CreateUserSchema = z
   .object({
      username: z.string().min(3).max(24),
      email: z.string().email(),
      firstName: z.string().nonempty().max(30),
      lastName: z.string().nonempty().max(30),
      photoUrl: z.string().url().nullable().default(null),
      bio: z.string().max(500).nullable().default(null),
      password: z.string().min(6).max(24),
      confirmPw: z.string().min(6).max(24)
   })
   .refine((value) => value.password === value.confirmPw, {
      message: "Passwords don't match",
      path: ["confirmPw"]
   })
   .transform((val) => {
      const { confirmPw, ...rest } = val;
      return rest;
   });

export const SelectUserSchema = createSelectSchema(users).omit({
   createdAt: true,
   updatedAt: true,
   encryptedPassword: true,
   refreshToken: true,
   provider: true
});

export const UpdateUserSchema = SelectUserSchema.partial()
   .omit({
      id: true,
      emailVerified: true
   })
   .refine((obj) => Object.values(obj).some((val) => val !== undefined), {
      message: "At least one property must be present"
   });

export const SigninUserSchema = z.object({
   email: z.string().email(),
   password: z.string()
});

// DTOs
export type CreateUserDto = z.output<typeof CreateUserSchema>;
export type SelectUserDto = z.infer<typeof SelectUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type SigninUserDto = z.infer<typeof SigninUserSchema>;
