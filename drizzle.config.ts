import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
 
export default {
   schema: "./src/schemas",
   out: "./drizzle",
   dbCredentials: {
      url: process.env.DATABASE_URL as string,
      authToken: process.env.DATABASE_AUTH_TOKEN as string
   }
} satisfies Config;
