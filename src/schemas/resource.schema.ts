import { createSelectSchema } from "drizzle-zod";
import { resources } from "../database/tables";

export const SelectResourceSchema = createSelectSchema(resources).omit({
   id: true,
   articleId: true,
   postId: true,
   authorId: true
});
