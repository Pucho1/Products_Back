import { Controller, Get, Post } from '@nestjs/common';
import type { Request } from 'express';

@Controller('products')
export class ProductsController {
  @Get()
  findAll(): string {
    return 'This action returns all products';
  }

  @Post()
  create(): string {
    return 'This action adds a new product';
  }
}
