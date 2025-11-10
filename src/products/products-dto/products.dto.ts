import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDtoToCreate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  category: number | null;

  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  category: number | null;

  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
