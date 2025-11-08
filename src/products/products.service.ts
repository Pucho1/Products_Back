/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductDto, ProductDtoToCreate } from './products-dto/products.dto';
import { Products } from './products-entity/products.entity';

@Injectable()
export class ProductsService {

  products: ProductDto[] = [];

  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  /**
   * Obtiene todos los productos
   * @returns Promise<ProductDto[]>
   */
  async getAllProducts(): Promise<ProductDto[]> {
    const products = await this.productsRepository.find();
    return products;
  }

  /**
   * Obtiene un producto por su ID
   * @returns Promise<ProductDto | NotFoundException>
   */
  async getProductById(id: string): Promise<ProductDto | NotFoundException> {
    const newId = parseInt(id, 10);
    const product = await this.productsRepository.findOne({ where: { id: newId } });

    if (!product){
      return new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  /**
   * Elimina todos los productos
   * @returns Promise<string>
   */
  async deleteAllProducts(): Promise<string> {
    await this.productsRepository.clear();

    return 'All products have been deleted';
  }

  /**
   * Elimina un producto por su ID
   * @returns Promise<string | NotFoundException>
   */
  async deleteProductById(id: string): Promise<string | NotFoundException> {

    const product = await this.getProductById(id);

    if (product instanceof NotFoundException) {
      return product;
    }

    await this.productsRepository.remove(product);

    return `Product with id ${id} has been deleted`;
  }

  /**
   * Actualiza un producto por su id 
   * @returns Promise<ProductDto | string>
   */
  async updateProduct(id: string, productData: ProductDto): Promise<ProductDto | string> {
    const product = await this.getProductById(id);

    if (product instanceof NotFoundException) {
      return product.message;
    }

    await this.productsRepository.update(product.id, productData);
    return `Product with id ${id} has been updated`;
  }

  /**
   * Renombra un producto por su ID
   * @param id: string
   * @returns Promise<string>
   */
  renameProduct(id: string): string {
    return `This action renames a product with id ${id}`;
  }

  /**
   * Crea un nuevo producto
   * @param productData: ProductDtoToCreate
   * @returns Promise<boolean>
   */
	async createProduct(productData: ProductDtoToCreate): Promise<boolean> {
    try {
      await this.productsRepository.save(productData);
    } catch (error) {
      return false;
    }
		return true;
	}

  // POR CATEGORIA const PRODUCTS = await this.productsRepository.findBy({ category: 'some-category' })

}
