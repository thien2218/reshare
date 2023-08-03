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

export const CreateUserSchema = createInsertSchema(user, {
   username: z.string().nonempty().max(50),
   name: z.string().nonempty().max(50),
   email: z.string().nonempty().email(),
   photoUrl: z.string().url(),
   bio: z.string().max(500)
})
   .omit({ encryptedPassword: true })
   .extend({
      password: z.string().min(6).max(24).optional(),
      confirmPw: z.string().min(6).max(24).optional()
   })
   .refine((value) => value.password && value.password === value.confirmPw, {
      message: "Passwords don't match",
      path: ["confirm"] // path of error
   });

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const SelectUserSchema = createSelectSchema(user).omit({
   encryptedPassword: true
});

export type SelectUserDto = z.infer<typeof SelectUserSchema>;

export const UpdateUserSchema = SelectUserSchema.partial().omit({
   id: true,
   emailVerified: true
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
