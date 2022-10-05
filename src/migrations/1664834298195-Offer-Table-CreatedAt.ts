import { MigrationInterface, QueryRunner } from 'typeorm';

export class OfferTableCreatedAt1664834298195 implements MigrationInterface {
  name = 'OfferTableCreatedAt1664834298195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` DROP COLUMN \`coverLetter\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD \`message\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD \`type\` enum ('proposal', 'invite') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`proposal\` DROP COLUMN \`type\``);
    await queryRunner.query(`ALTER TABLE \`proposal\` DROP COLUMN \`message\``);
    await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD \`coverLetter\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\` (\`offerId\`)`,
    );
  }
}
