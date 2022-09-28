import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664368157253 implements MigrationInterface {
  name = 'migrations1664368157253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`isSystemMessage\` \`messageType\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP COLUMN \`messageType\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD \`messageType\` enum ('fromUser', 'fromSystem') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP COLUMN \`messageType\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD \`messageType\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`messageType\` \`isSystemMessage\` tinyint NOT NULL`,
    );
  }
}
