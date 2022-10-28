import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({
    description: 'Created category',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiCreatedResponse({
    description: 'All categories',
    type: [Category],
  })
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
