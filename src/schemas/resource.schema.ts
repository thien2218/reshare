import { createSelectSchema } from "drizzle-zod";
import { resources } from "../database/tables";
import { SelectUserSchema } from "./user.schema";
import { z } from "zod";

export const SelectResourceSchema = z.object({
   details: createSelectSchema(resources).omit({
      id: true,
      articleId: true,
      postId: true,
      authorId: true
   }),
   author: SelectUserSchema.omit({
      createdAt: true,
      updatedAt: true,
      bio: true
   })
});
