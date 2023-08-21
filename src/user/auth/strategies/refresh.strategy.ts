import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyRequest } from "fastify";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
   constructor(protected configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([
            (req) => {
               if (req.cookies) {
                  return req.cookies["reshare-refresh-token"];
               } else {
                  return null;
               }
            }
         ]),
         secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET"),
         passReqToCallback: true
      });
   }

   async validate(req: FastifyRequest, payload: any) {
      return {
         ...payload,
         refresh_token: req.cookies["reshare-refresh-token"]
      };
   }
}
