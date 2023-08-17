import fastifyCookie from "@fastify/cookie";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
   FastifyAdapter,
   NestFastifyApplication
} from "@nestjs/platform-fastify";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function bootstrap() {
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
   );

   app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET
   });

   await app.listen(3333);
}
bootstrap();
