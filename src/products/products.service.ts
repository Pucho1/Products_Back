/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './products.dto';



@Injectable()
export class ProductsService {

  products: ProductDto[] = [];

  getAllProducts(): ProductDto[] {
    return this.products;
  }

  getProductById(id: string): ProductDto | NotFoundException {
    const newId = parseInt(id, 10);
    const product = this.products.find(prod => prod.id === newId);

    if (!product){
      return new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  deleteAllProducts(): string {
    return 'All products have been deleted';
  }

  deleteProductById(id: string): string {
    return `This action deletes a product with id ${id}`;
  }

  updateProduct(id: string): string {
    return `This action updates a product with id ${id}`;
  }

  renameProduct(id: string): string {
    return `This action renames a product with id ${id}`;
  }

	createProducts(productData: ProductDto): ProductDto[] {
		this.products.push({
      ...productData,
      id: this.products.length + 1,
    });

		return this.products;
	}

}
