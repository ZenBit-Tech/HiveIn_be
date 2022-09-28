import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableRefactor1663840167589 implements MigrationInterface {
  name = 'TableRefactor1663840167589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP FOREIGN KEY \`FK_89a23a65177ee25ca71cdf4a2fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_e57b156157d41fa38c1c1cd06d0\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_89a23a65177ee25ca71cdf4a2f\` ON \`job_post\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`freelancerId\` \`offerId\` int NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`offer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('pending', 'active', 'rejected') NOT NULL DEFAULT 'pending', \`jobPostId\` int NULL, \`freelancerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat_room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('forAll', 'freelancerOnly', 'clientOnly') NOT NULL, \`jobPostId\` int NULL, \`freelancerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fromUserId\` int NOT NULL, \`toUserId\` int NOT NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`deleted\` tinyint NOT NULL DEFAULT 0, \`type\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP COLUMN \`contractId\``,
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
      `ALTER TABLE \`chat_room\` ADD CONSTRAINT \`FK_4763ffffcb168b979b2a7ba954a\` FOREIGN KEY (\`jobPostId\`) REFERENCES \`job_post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` ADD CONSTRAINT \`FK_9086a207c814aa75d822aa7f60a\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`chat_room\` DROP FOREIGN KEY \`FK_9086a207c814aa75d822aa7f60a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_room\` DROP FOREIGN KEY \`FK_4763ffffcb168b979b2a7ba954a\``,
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
      `ALTER TABLE \`job_post\` ADD \`contractId\` int NULL`,
    );
    await queryRunner.query(`DROP TABLE \`notification\``);
    await queryRunner.query(`DROP TABLE \`chat_room\``);
    await queryRunner.query(`DROP TABLE \`offer\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`offerId\` \`freelancerId\` int NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_89a23a65177ee25ca71cdf4a2f\` ON \`job_post\` (\`contractId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_e57b156157d41fa38c1c1cd06d0\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` ADD CONSTRAINT \`FK_89a23a65177ee25ca71cdf4a2fd\` FOREIGN KEY (\`contractId\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
