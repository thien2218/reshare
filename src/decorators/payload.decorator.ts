import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export type UserPayload = {
   sub: string;
   username: string;
   first_name: string;
   last_name: string;
   email: string;
   email_verified: boolean;
};

export type RefreshPayload = UserPayload & {
   refresh_token: string;
   exp: number;
};

export const Payload = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.payload;
});
