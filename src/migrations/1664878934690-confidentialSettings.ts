import { MigrationInterface, QueryRunner } from 'typeorm';

export class confidentialSettings1664878934690 implements MigrationInterface {
  name = 'confidentialSettings1664878934690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`confidentialSetting\` enum ('visible', 'phoneOnly', 'emailOnly', 'hidden') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`confidentialSetting\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
