import { ApiProperty } from '@nestjs/swagger';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

export class FilteredJobsDto {
  @ApiProperty({
    description: 'Array with job posts',
    type: [JobPost],
  })
  data: JobPost[];

  @ApiProperty({
    description: 'Total count of job posts',
    type: Number,
    example: 5,
  })
  totalCount: number;
}
