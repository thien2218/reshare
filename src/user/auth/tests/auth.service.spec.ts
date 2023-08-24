import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MockConfigService } from "src/database/__mocks__/config.service";
import { MockJwtService } from "../__mocks__/jwt.service";
import { DatabaseService } from "src/database/database.service";

jest.mock("../../../database/database.service");

describe("AuthService", () => {
   let service: AuthService;
   let dbService: DatabaseService;

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
         .compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<AuthService>(AuthService);
      jest.clearAllMocks();
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
