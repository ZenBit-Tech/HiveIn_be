import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsRefreshToken1663942689355
  implements MigrationInterface
{
  name = 'NotificationsRefreshToken1663942689355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fromUserId\` int NOT NULL, \`toUserId\` int NOT NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`deleted\` tinyint NOT NULL DEFAULT 0, \`type\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`currentHashedRefreshToken\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_8317ddf1110cc4ae2fa848c959a\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_af00ff08918ea1e83aa3db736be\` FOREIGN KEY (\`toUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_af00ff08918ea1e83aa3db736be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_8317ddf1110cc4ae2fa848c959a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`currentHashedRefreshToken\``,
    );
    await queryRunner.query(`DROP TABLE \`notification\``);
  }
}
