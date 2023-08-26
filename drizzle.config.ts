import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv"

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
 
export default {
   schema: "./src/schemas/tables",
   out: "./drizzle",
   dbCredentials: {
      url: process.env.DATABASE_URL as string,
      authToken: process.env.DATABASE_AUTH_TOKEN as string
   }
} satisfies Config;
