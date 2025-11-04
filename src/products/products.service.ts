/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {

  getAllProducts(): string[] {
    return ['Product 1', 'Product 2', 'Product 3'];
  }

	getProductById(id: string): string {
		return `Product with id ${id}`;
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

	createProducts(): string {
		return 'This action adds a new product';
	}

}
