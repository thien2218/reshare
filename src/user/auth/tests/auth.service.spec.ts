import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DB_CONNECTION } from "src/constants";
import { MockDbConnection } from "src/database/__mocks__/database.service";
import { MockConfigService } from "src/database/__mocks__/config.service";
import { MockJwtService } from "../__mocks__/jwt.service";

describe("AuthService", () => {
   let service: AuthService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule, JwtModule],
         providers: [
            AuthService,
            {
               provide: ConfigService,
               useValue: MockConfigService
            }
         ]
      })
         .overrideProvider(JwtModule)
         .useValue(MockJwtService)
         .overrideProvider(DB_CONNECTION)
         .useValue(MockDbConnection)
         .compile();

      service = module.get<AuthService>(AuthService);
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("signup", () => {
      it("should be defined", () => {
         expect(service.signup).toBeDefined();
      });
   });
});
