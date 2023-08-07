import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const MockConfigService = {
   get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
         case "DATABASE_URL":
            return process.env.DATABASE_URL;
         case "DATABASE_AUTH_TOKEN":
            return process.env.DATABASE_AUTH_TOKEN;
         default:
            return null;
      }
   })
};
