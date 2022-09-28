import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableRefactor1663843778044 implements MigrationInterface {
  name = 'TableRefactor1663843778044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`message_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`senderId\` int NULL, \`chatRoomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_entity\` ADD CONSTRAINT \`FK_e88494eab57fef78157e330fe29\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_entity\` ADD CONSTRAINT \`FK_5541550140d4bb79507a523450c\` FOREIGN KEY (\`chatRoomId\`) REFERENCES \`chat_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_entity\` DROP FOREIGN KEY \`FK_5541550140d4bb79507a523450c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_entity\` DROP FOREIGN KEY \`FK_e88494eab57fef78157e330fe29\``,
    );
    await queryRunner.query(`DROP TABLE \`message_entity\``);
  }
}
