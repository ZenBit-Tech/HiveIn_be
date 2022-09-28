import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatTables1664386112256 implements MigrationInterface {
  name = 'ChatTables1664386112256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_e57b156157d41fa38c1c1cd06d0\` ON \`contracts\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`messageType\` enum ('fromUser', 'fromSystem') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`senderId\` int NULL, \`chatRoomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP COLUMN \`contractId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD UNIQUE INDEX \`IDX_b61e944e4f72458a7cd75e5902\` (\`offerId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_b61e944e4f72458a7cd75e5902\` ON \`contracts\` (\`offerId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_d437c9cf37f8a470d7ae2ad4103\` FOREIGN KEY (\`jobPostId\`) REFERENCES \`job_post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_b2958649ce4bae1ee9f07507da5\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_b61e944e4f72458a7cd75e59020\` FOREIGN KEY (\`offerId\`) REFERENCES \`offer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_f3cc0ca0c4b191410f1e0ab5d21\` FOREIGN KEY (\`chatRoomId\`) REFERENCES \`chat_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` ADD CONSTRAINT \`FK_4763ffffcb168b979b2a7ba954a\` FOREIGN KEY (\`jobPostId\`) REFERENCES \`job_post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` ADD CONSTRAINT \`FK_9086a207c814aa75d822aa7f60a\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` DROP FOREIGN KEY \`FK_9086a207c814aa75d822aa7f60a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` DROP FOREIGN KEY \`FK_4763ffffcb168b979b2a7ba954a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_f3cc0ca0c4b191410f1e0ab5d21\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_b61e944e4f72458a7cd75e59020\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_b2958649ce4bae1ee9f07507da5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_d437c9cf37f8a470d7ae2ad4103\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_b61e944e4f72458a7cd75e5902\` ON \`contracts\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP INDEX \`IDX_b61e944e4f72458a7cd75e5902\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` ADD \`contractId\` int NULL`,
    );
    await queryRunner.query(`DROP TABLE \`message\``);
    await queryRunner.query(
      `CREATE INDEX \`FK_e57b156157d41fa38c1c1cd06d0\` ON \`contracts\` (\`offerId\`)`,
    );
  }
}
