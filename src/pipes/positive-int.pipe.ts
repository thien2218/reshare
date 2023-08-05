import {
   PipeTransform,
   Injectable,
   ArgumentMetadata,
   BadRequestException
} from "@nestjs/common";

@Injectable()
export class PositiveIntPipe implements PipeTransform {
   transform(value: any, metadata: ArgumentMetadata) {
      const val = parseInt(value, 10);

      if (isNaN(val) || val <= 0) {
         throw new BadRequestException(
            `Validation failed: ${metadata.data} must be a positive integer`
         );
      }

      return val;
   }
}
