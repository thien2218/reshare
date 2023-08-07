import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL as string;
const authToken = process.env.DATABASE_AUTH_TOKEN as string;

const client = createClient({ url, authToken });
const db = drizzle(client);

async function main() {
   console.log("Migration started...");
   await migrate(db, { migrationsFolder: "drizzle" });
   console.log("Migration completed successfully!");
   process.exit(0);
}

main().catch((err) => {
   console.log(err);
});
