import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatTables1664381970105 implements MigrationInterface {
  name = 'ChatTables1664381970105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_0885ce6d79390e2a166e2aecd8c\` ON \`freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`FK_dba25590105b78ad1a6adfbc6ae\` ON \`forgot_password\``,
    );
    await queryRunner.query(
      `DROP INDEX \`FK_e57b156157d41fa38c1c1cd06d0\` ON \`contracts\``,
    );
    await queryRunner.query(
      `DROP INDEX \`FK_201d6e0e869991752097e2b0653\` ON \`proposal\``,
    );
    await queryRunner.query(
      `DROP INDEX \`FK_768990edbd00725968090eccd33\` ON \`proposal\``,
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
      `ALTER TABLE \`job_post\` ADD CONSTRAINT \`FK_21c9f1f4078aa5c4e45cbbdbaca\` FOREIGN KEY (\`fileId\`) REFERENCES \`local_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer\` ADD CONSTRAINT \`FK_0885ce6d79390e2a166e2aecd8c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer\` ADD CONSTRAINT \`FK_3ecc6951b7f7133932a409a3fb7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`forgot_password\` ADD CONSTRAINT \`FK_dba25590105b78ad1a6adfbc6ae\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_b61e944e4f72458a7cd75e59020\` FOREIGN KEY (\`offerId\`) REFERENCES \`offer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD CONSTRAINT \`FK_201d6e0e869991752097e2b0653\` FOREIGN KEY (\`jobPostId\`) REFERENCES \`job_post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD CONSTRAINT \`FK_768990edbd00725968090eccd33\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post_skills_skill\` ADD CONSTRAINT \`FK_da75e60a1d514422767a0880187\` FOREIGN KEY (\`jobPostId\`) REFERENCES \`job_post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post_skills_skill\` ADD CONSTRAINT \`FK_56e603ad9b063928f47e7a110f8\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer_skills_skill\` ADD CONSTRAINT \`FK_21b295654e9578456111f72e802\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer_skills_skill\` ADD CONSTRAINT \`FK_3d882a5da13cf02e99b1dc984df\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_recently_viewed_freelancers_freelancer\` ADD CONSTRAINT \`FK_f8b290f872409f0d11b1b5f6e89\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_recently_viewed_freelancers_freelancer\` ADD CONSTRAINT \`FK_0ceb9a088cb0aeca2dedd618e9c\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_saved_freelancers_freelancer\` ADD CONSTRAINT \`FK_4905e52dc9d9d9b6c1efad21e33\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_saved_freelancers_freelancer\` ADD CONSTRAINT \`FK_59f6d9c3a7591a329dcff8c546d\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_hired_freelancers_freelancer\` ADD CONSTRAINT \`FK_5079e28c7adaef86f94c8c95394\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_hired_freelancers_freelancer\` ADD CONSTRAINT \`FK_edf2d74f9af47f13eea27e45b86\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_hired_freelancers_freelancer\` DROP FOREIGN KEY \`FK_edf2d74f9af47f13eea27e45b86\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_hired_freelancers_freelancer\` DROP FOREIGN KEY \`FK_5079e28c7adaef86f94c8c95394\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_saved_freelancers_freelancer\` DROP FOREIGN KEY \`FK_59f6d9c3a7591a329dcff8c546d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_saved_freelancers_freelancer\` DROP FOREIGN KEY \`FK_4905e52dc9d9d9b6c1efad21e33\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_recently_viewed_freelancers_freelancer\` DROP FOREIGN KEY \`FK_0ceb9a088cb0aeca2dedd618e9c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_recently_viewed_freelancers_freelancer\` DROP FOREIGN KEY \`FK_f8b290f872409f0d11b1b5f6e89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer_skills_skill\` DROP FOREIGN KEY \`FK_3d882a5da13cf02e99b1dc984df\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer_skills_skill\` DROP FOREIGN KEY \`FK_21b295654e9578456111f72e802\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post_skills_skill\` DROP FOREIGN KEY \`FK_56e603ad9b063928f47e7a110f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post_skills_skill\` DROP FOREIGN KEY \`FK_da75e60a1d514422767a0880187\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` DROP FOREIGN KEY \`FK_768990edbd00725968090eccd33\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` DROP FOREIGN KEY \`FK_201d6e0e869991752097e2b0653\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_b61e944e4f72458a7cd75e59020\``,
    );
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
      `ALTER TABLE \`forgot_password\` DROP FOREIGN KEY \`FK_dba25590105b78ad1a6adfbc6ae\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer\` DROP FOREIGN KEY \`FK_3ecc6951b7f7133932a409a3fb7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`freelancer\` DROP FOREIGN KEY \`FK_0885ce6d79390e2a166e2aecd8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP FOREIGN KEY \`FK_21c9f1f4078aa5c4e45cbbdbaca\``,
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
      `CREATE INDEX \`FK_768990edbd00725968090eccd33\` ON \`proposal\` (\`freelancerId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_201d6e0e869991752097e2b0653\` ON \`proposal\` (\`jobPostId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_e57b156157d41fa38c1c1cd06d0\` ON \`contracts\` (\`offerId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_dba25590105b78ad1a6adfbc6ae\` ON \`forgot_password\` (\`userId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_0885ce6d79390e2a166e2aecd8c\` ON \`freelancer\` (\`categoryId\`)`,
    );
  }
}
