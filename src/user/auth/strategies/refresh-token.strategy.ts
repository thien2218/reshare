import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
   constructor(protected configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => {
               if (req.cookies) {
                  return req.cookies["realtor-refresh-token"];
               } else {
                  return null;
               }
            }
         ]),
         secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET"),
         passReqToCallback: true
      });
   }

   async validate(req: Request, payload: any) {
      return {
         ...payload,
         refresh_token: req.cookies["realtor-refresh-token"]
      };
   }
}
