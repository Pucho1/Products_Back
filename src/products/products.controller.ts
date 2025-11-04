/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
// @Controller({})
export class ProductsController {
  productsService: ProductsService;

  constructor(productsService: ProductsService){
    this.productsService = productsService;
  }
  
  @Get('/all')
  findAll(): string[] {
    return this.productsService.getAllProducts();
  }

  @Post('/create')
  create(): string {
    return this.productsService.createProducts();
  }

  @Put('/update')
  update(id: string): string {
    return this.productsService.updateProduct(id);
  }

  @Patch('/rename')
  renameProduct(id: string): string {
    return this.productsService.renameProduct(id);
  }

  @Delete('/delete')
  delete(): string {
    return this.productsService.deleteAllProducts();
  }

}
