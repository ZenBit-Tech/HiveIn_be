import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAvatarAdded1665329033752 implements MigrationInterface {
  name = 'UserAvatarAdded1665329033752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`public_file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_3e1f52ec904aed992472f2be14\` (\`avatarId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_3e1f52ec904aed992472f2be14\` ON \`users\` (\`avatarId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_3e1f52ec904aed992472f2be147\` FOREIGN KEY (\`avatarId\`) REFERENCES \`public_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_3e1f52ec904aed992472f2be147\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_3e1f52ec904aed992472f2be14\` ON \`users\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP INDEX \`IDX_3e1f52ec904aed992472f2be14\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarId\``);
    await queryRunner.query(`DROP TABLE \`public_file\``);
  }
}
