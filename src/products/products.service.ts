/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductDtoToCreate, ProductUpdateDto } from './products-dto/products.dto';
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
   * Si se proporciona una categoría, filtra los productos por esa categoría
   * @returns Promise<ProductDto[]>
   */
  async getAllProductsAndByFilter(category?: number): Promise<Products[]> {

    const query = this.productsRepository.createQueryBuilder('product');

    if (category) {
      query.where('product.category = :category', {category})
    }

    const products = await query.getMany();

    return products;
  }

  /**
   * Obtiene un producto por su ID
   * @returns Promise<ProductDto | NotFoundException>
   */
  async getProductById(id: number): Promise<Products> {
   
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['category'] });

    if (!product){
      throw new NotFoundException(`Product with id ${id} not found`);
    };

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
  async deleteProductById(id: number): Promise<string> {

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
  async updateProduct(id: number, productData: ProductUpdateDto): Promise<Products> {

    let category: any = null;
    const preloadData: any = { id, ...productData };

    if (productData.category) {
      category = await this.categoryService.getCategoriesById(productData.category);
      preloadData.category = category ?? null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const product = await this.productsRepository.preload( preloadData  );

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return this.productsRepository.save(product);
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

    if (category instanceof NotFoundException) {
      throw new NotFoundException(`Category with id ${productData.category} not found`);
    }
    await this.productsRepository.save({ ...productData, category });

		return true;
	}

}
