import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsRefactored1665006123606
  implements MigrationInterface
{
  name = 'NotificationsRefactored1665006123606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_8317ddf1110cc4ae2fa848c959a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_af00ff08918ea1e83aa3db736be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`fromUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`toUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`read\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`updatedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`isRead\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`text\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`messageId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`offerId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`proposalId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`type\` enum ('message', 'offer', 'invite') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_e77398d5c03520ca87c7c03ca9f\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_caa44dad653517e1d805767d7ef\` FOREIGN KEY (\`offerId\`) REFERENCES \`offer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_7910744e60061cf7b0da8e39ebb\` FOREIGN KEY (\`proposalId\`) REFERENCES \`proposal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_7910744e60061cf7b0da8e39ebb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_caa44dad653517e1d805767d7ef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_e77398d5c03520ca87c7c03ca9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`proposalId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`offerId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`messageId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`text\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`isRead\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`deleted\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`read\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`toUserId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`fromUserId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_af00ff08918ea1e83aa3db736be\` FOREIGN KEY (\`toUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_8317ddf1110cc4ae2fa848c959a\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
