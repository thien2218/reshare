import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { users } from "../tables";

// Validation schemas
const UserObjSchema = z.object({
   id: z.string(),
   username: z.string(),
   firstName: z.string(),
   lastName: z.string(),
   email: z.string().email(),
   emailVerified: z.boolean(),
   photoUrl: z.string().nullable()
});

export const UserSchema = UserObjSchema.transform((obj) => {
   const { id, ...rest } = obj;
   return { sub: id, ...rest };
});

export const UserRefreshSchema = UserObjSchema.extend({
   refreshToken: z.string(),
   exp: z.number()
}).transform((obj) => {
   const { id, ...rest } = obj;
   return { sub: id, ...rest };
});

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
export type UserDto = z.infer<typeof UserSchema>;
export type UserRefreshDto = z.infer<typeof UserRefreshSchema>;
export type CreateUserDto = z.output<typeof CreateUserSchema>;
export type SelectUserDto = z.infer<typeof SelectUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type SigninUserDto = z.infer<typeof SigninUserSchema>;
