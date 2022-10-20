import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  create({ name }: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save({
      name,
    });
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
