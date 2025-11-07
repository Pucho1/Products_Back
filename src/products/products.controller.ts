/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './products-dto/products.dto';

@Controller('products')
// @Controller({})
export class ProductsController {
  productsService: ProductsService;

  constructor(productsService: ProductsService){
    this.productsService = productsService;
  }
  
  // Asi recibo los query params que me pueden servir para filtros, paginacion, etc
  @Get('/all')
  findAll(@Query() query: any) {
    console.log(query);
    return this.productsService.getAllProducts();
  }

  @Get('/:id')
  getProductById(@Param('id') id: string) {
    console.log(id);
    return this.productsService.getProductById(id);
  }

  // Asi recibo el body de la peticion
  @Post('/create')
  create(@Body() productData: ProductDto) {
    console.log(productData);
    return this.productsService.createProducts(productData);
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
  delete(@Param('id') id: string): string {
    return this.productsService.deleteProductById(id);
  }

  @Delete('/delete/all')
  deleteAll(): string {
    return this.productsService.deleteAllProducts();
  }

}
