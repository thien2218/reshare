import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
         // Validate and transform @Query, @Param and custom param decorator parameters
         transformOptions: { enableImplicitConversion: true }
      })
   );
   app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
   );
   await app.listen(3333);
}
bootstrap();
