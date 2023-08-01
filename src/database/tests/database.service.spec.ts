import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../database.module";
import { DB_CONNECTION } from "src/constants";

describe("DatabaseModule", () => {
   let dbConnection;

   beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule]
      }).compile();

      dbConnection = moduleRef.get(DB_CONNECTION);
   });

   it("should connect to the database", async () => {
      const result = await dbConnection.execute("SELECT 1+1 as result");
      expect(result.rows[0].result).toBe(2);
   });
});
