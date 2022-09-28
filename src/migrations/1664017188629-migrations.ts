import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664017188629 implements MigrationInterface {
  name = 'migrations1664017188629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat_room_connected\` (\`id\` int NOT NULL AUTO_INCREMENT, \`socketId\` varchar(255) NOT NULL, \`userId\` int NULL, \`roomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_connected\` (\`id\` int NOT NULL AUTO_INCREMENT, \`socketId\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room_connected\` ADD CONSTRAINT \`FK_b6829fff33cb5a7f87129014587\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room_connected\` ADD CONSTRAINT \`FK_e168ff75d048e27694d9a3742b6\` FOREIGN KEY (\`roomId\`) REFERENCES \`chat_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_connected\` ADD CONSTRAINT \`FK_eeb1a565f0f679a3ad288a7d312\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_connected\` DROP FOREIGN KEY \`FK_eeb1a565f0f679a3ad288a7d312\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room_connected\` DROP FOREIGN KEY \`FK_e168ff75d048e27694d9a3742b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room_connected\` DROP FOREIGN KEY \`FK_b6829fff33cb5a7f87129014587\``,
    );
    await queryRunner.query(`DROP TABLE \`user_connected\``);
    await queryRunner.query(`DROP TABLE \`chat_room_connected\``);
  }
}
