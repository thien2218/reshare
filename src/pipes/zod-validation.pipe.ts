import {
   ArgumentMetadata,
   BadRequestException,
   Injectable,
   PipeTransform
} from "@nestjs/common";
import * as z from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
   constructor(private readonly schema: z.ZodType<any, any>) {}

   transform(value: object, { type }: ArgumentMetadata) {
      if (type === "body") {
         const parsed = this.schema.safeParse(value);

         if (parsed.success) {
            return parsed.data;
         } else {
            throw new BadRequestException(parsed.error.issues);
         }
      }

      return value;
   }
}
