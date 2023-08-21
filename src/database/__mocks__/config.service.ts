import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const MockConfigService = {
   get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
         case "DATABASE_URL":
            return process.env.DATABASE_URL;
         case "DATABASE_AUTH_TOKEN":
            return process.env.DATABASE_AUTH_TOKEN;
         case "ACCESS_TOKEN_SECRET":
            return "access_token_secret";
         case "REFRESH_TOKEN_SECRET":
            return "refresh_token_secret";
         default:
            return "";
      }
   })
};
