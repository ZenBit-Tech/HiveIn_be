import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocalFile {
  @ApiProperty({
    description: 'Id of file',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Name of file',
    example: 'Lorem',
  })
  @Column()
  filename: string;

  @ApiProperty({
    description: 'Path to file',
    example: 'https',
  })
  @Column()
  path: string;

  @ApiProperty({
    description: 'MIME types of file',
    example: 'jpeg',
  })
  @Column()
  mimetype: string;
}
