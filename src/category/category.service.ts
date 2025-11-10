/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {};

  /**
   * 
   * @param createCategoryDto 
   * @returns 
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<UpdateCategoryDto> {

    const category = await this.categoryRepository.save(createCategoryDto);

    return category;
  };

 /**
   * 
   * @returns 
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  };

  findOne(id: number): Promise<Category> {
    const category= this.getCategoriesById(id);
    return category;
  };

   /**
   * 
   * @param updateCategoryDto 
   * @returns 
   */
  async update( updateCategoryDto: UpdateCategoryDto): Promise<UpdateCategoryDto> {
    const category = await this.categoryRepository.preload(updateCategoryDto);
    if (!category) {
      throw new NotFoundException(`Category ${updateCategoryDto.id} not found`);
    }
    return await this.categoryRepository.save(category);
  };

  async remove(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return true;
  };

   /**
   * 
   * @param id 
   * @returns 
   */
  async getCategoriesById(id: number): Promise<Category> {

    const category  = await this.categoryRepository.findOne({ where : { id } });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return category;
    
  };
}
