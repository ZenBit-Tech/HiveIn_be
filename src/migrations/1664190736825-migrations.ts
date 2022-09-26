import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664190736825 implements MigrationInterface {
  name = 'migrations1664190736825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD \`isSystemMessage\` tinyint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP COLUMN \`isSystemMessage\``,
    );
  }
}
