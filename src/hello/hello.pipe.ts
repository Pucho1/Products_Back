/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RangePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('Metadata:', metadata);
    console.log('Original Value:', value);

    return { ...value, start: Number(value.start), end: Number(value.end) };
  }
}
