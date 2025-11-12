import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    const category = await this.categoryService.create(createCategoryDto);
    return category;
  }

  @Get()
  async findAll(): Promise<UpdateCategoryDto[]> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UpdateCategoryDto> {
    const response = await this.categoryService.findOne(+id);
    return response;
  }

  @Patch(':id')
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.categoryService.remove(+id);
  }
}
