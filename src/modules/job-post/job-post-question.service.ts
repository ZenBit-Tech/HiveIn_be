import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPostQuestion } from './entities/job-post-question.entity';
import { Repository } from 'typeorm';
import { QuestionDto } from './dto/update-job-post.dto';

@Injectable()
export class JobPostQuestionService {
  constructor(
    @InjectRepository(JobPostQuestion)
    private questionRepository: Repository<JobPostQuestion>,
  ) {}
  async save(question: string, postId: number) {
    return await this.questionRepository.save({
      question: question,
      jobPost: { id: postId },
    });
  }

  async update(question: QuestionDto) {
    const foundQuestion = await this.questionRepository.findOne({
      where: { id: question.id },
    });
    if (!foundQuestion) {
      throw new HttpException('question not found', 404);
    }
    return await this.questionRepository.update(
      { id: question.id },
      { question: question.question },
    );
  }
}
