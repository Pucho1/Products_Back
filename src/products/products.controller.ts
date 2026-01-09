/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductDtoToCreate, ProductUpdateDto } from './products-dto/products.dto';
import { HandlerProductsGuard } from './guards/handler-products-guard.guard';

// Estos @xxxxxxx son decoradores los cuales son metadoatos que nest usa para al 
//     momento de iniciar la aplicacion saber que es cada clase, metodo, propiedad, etc
@Controller('products')
// @Controller({})
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  // Asi recibo los query params que me pueden servir para filtros, paginacion, etc
  @Get()
  async findAllAndByFilter(@Query('category') category?: number) {
    return await this.productsService.getAllProductsAndByFilter(category);
  }

  @UseGuards(HandlerProductsGuard)
  @Get('/:id')
  async findProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto | NotFoundException> {

    const product = await this.productsService.getProductById(id);

    return {...product,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category.id || null,
    };
  }

  // Asi recibo el body de la peticion
  @Post('/create')
  async create(@Body() productData: ProductDtoToCreate): Promise<boolean> {
    const created = await this.productsService.createProduct(productData);
    return created;
  }

  @Patch('/update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() productData: ProductUpdateDto): Promise<ProductDto | string> {

    const updatedProduct = await this.productsService.updateProduct( id, productData);

    return {...updatedProduct,
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      quantity: updatedProduct.quantity,
      category: updatedProduct.category.id || null,
    };
  }

  @Patch('/rename')
  renameProduct(id: string): string {
    return this.productsService.renameProduct(id);
  }

  @Delete('/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.productsService.deleteProductById(id);
  }

  @Delete('/delete/all')
  async deleteAll(): Promise<string> {
    return await this.productsService.deleteAllProducts();
  }

}
