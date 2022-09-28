import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664365719776 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chat_room_connected\``);
    await queryRunner.query(`DROP TABLE \`user_connected\``);
    await queryRunner.query(`DROP TABLE \`message_entity\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chat_room_connected\``);
    await queryRunner.query(`DROP TABLE \`user_connected\``);
    await queryRunner.query(`DROP TABLE \`message_entity\``);
  }
}
