import { MigrationInterface, QueryRunner } from 'typeorm';

export class OfferTableStatus1664936196723 implements MigrationInterface {
  name = 'OfferTableStatus1664936196723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`offer\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` CHANGE \`status\` \`status\` enum ('pending', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`offer\` CHANGE \`status\` \`status\` enum ('pending', 'active', 'rejected') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`createdAt\``);
  }
}
