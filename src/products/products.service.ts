/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductDto, ProductDtoToCreate } from './products-dto/products.dto';
import { Products } from './products-entity/product.entity';
import { CategoryService } from '../category/category.service';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private readonly categoryService: CategoryService
  ) {}

  /**
   * Obtiene todos los productos
   * @returns Promise<ProductDto[]>
   */
  async getAllProducts(): Promise<Products[]> {
    const products = await this.productsRepository.find();
    return products;
  }

  /**
   * Obtiene un producto por su ID
   * @returns Promise<ProductDto | NotFoundException>
   */
  async getProductById(id: string): Promise<Products> {
    const newId = parseInt(id, 10);
    const product = await this.productsRepository.findOne({ where: { id: newId } });

    if (!product){
      throw new NotFoundException(`Product with id ${id} not found`);
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
  async deleteProductById(id: string): Promise<string> {

    const product = await this.getProductById(id);

    if (product instanceof NotFoundException) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productsRepository.remove(product);

    return `Product with id ${id} has been deleted`;
  }

  /**
   * Actualiza un producto por su id 
   * @returns Promise<ProductDto | string>
   */
  async updateProduct(id: string, productData: ProductDto): Promise<Products | string> {
    const product = await this.getProductById(id);

    if (product instanceof NotFoundException) {
      return product.message;
    }

    let category: any = null;
    if (productData.category) {
      category = await this.categoryService.getCategoriesById(productData.category);
    }

    await this.productsRepository.update(product.id,
      { ...productData, category:  category ?? null });
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
    let category: any = null;

      if (productData.category) {
        category = await this.categoryService.getCategoriesById(productData.category);
      }
      await this.productsRepository.save({ ...productData, category:  category ?? null });

      if (category instanceof NotFoundException) {
        throw new NotFoundException(`Category with id ${productData.category} not found`);
      }
		return true;
	}

  

  // POR CATEGORIA const PRODUCTS = await this.productsRepository.findBy({ category: 'some-category' })

}
