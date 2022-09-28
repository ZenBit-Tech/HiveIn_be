import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsRefreshToken1663942689355
  implements MigrationInterface
{
  name = 'NotificationsRefreshToken1663942689355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`currentHashedRefreshToken\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`currentHashedRefreshToken\``,
    );
  }
}
