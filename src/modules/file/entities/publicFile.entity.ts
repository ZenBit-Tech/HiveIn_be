import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @ApiProperty({
    description: 'Id of public file',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'URL of public file',
    example: 'https',
  })
  @Column()
  public url: string;

  @ApiProperty({
    description: 'Unique key of public file',
    example: 'avatar/wfiewejif328292krjerg',
  })
  @Column()
  public key: string;
}

export default PublicFile;
