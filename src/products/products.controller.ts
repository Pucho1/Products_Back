/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductDtoToCreate } from './products-dto/products.dto';

// Estos @xxxxxxx son decoradores los cuales son metadoatos que nest usa para al 
//     momento de iniciar la aplicacion saber que es cada clase, metodo, propiedad, etc
@Controller('products')
// @Controller({})
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  // Asi recibo los query params que me pueden servir para filtros, paginacion, etc
  @Get('/all')
  async findAll(@Query() query: any) {
    console.log(query);
    return await this.productsService.getAllProducts();
  }

  @Get('/:id')
  findProductById(@Param('id') id: string) {
    console.log(id);
    return this.productsService.getProductById(id);
  }

  // Asi recibo el body de la peticion
  @Post('/create')
  create(@Body() productData: ProductDtoToCreate): Promise<boolean> {
    console.log(productData);
    const created = this.productsService.createProduct(productData);
    return created;
  }

  @Put('/update')
  async update(id: string, @Body() productData: ProductDto): Promise<ProductDto | string> {
    return await this.productsService.updateProduct(id, productData);
  }

  @Patch('/rename')
  renameProduct(id: string): string {
    return this.productsService.renameProduct(id);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<string | NotFoundException> {
    return await this.productsService.deleteProductById(id);
  }

  @Delete('/delete/all')
  async deleteAll(): Promise<string> {
    return await this.productsService.deleteAllProducts();
  }

}
