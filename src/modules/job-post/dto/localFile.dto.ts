import { ApiProperty } from '@nestjs/swagger';

export class LocalFileDto {
  @ApiProperty({
    description: 'Name of file',
    example: 'Lorem Ipsum',
  })
  filename: string;

  @ApiProperty({
    description: 'Path to file',
    example: 'https',
  })
  path: string;

  @ApiProperty({
    description: 'MIME types of file',
    example: 'jpeg',
  })
  mimetype: string;
}
