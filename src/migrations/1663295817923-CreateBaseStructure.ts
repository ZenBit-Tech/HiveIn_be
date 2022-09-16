import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBaseStructure1663295817923 implements MigrationInterface {
  name = 'CreateBaseStructure1663295817923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`education\` (\`id\` int NOT NULL AUTO_INCREMENT, \`city\` varchar(255) NOT NULL, \`degree\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`school\` varchar(255) NOT NULL, \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`active\` tinyint NOT NULL DEFAULT 1, \`freelancerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`experience\` (\`id\` int NOT NULL AUTO_INCREMENT, \`city\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`employer\` varchar(255) NOT NULL, \`jobTitle\` varchar(255) NOT NULL, \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`freelancerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`local_file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`contracts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startDate\` datetime NULL, \`endDate\` datetime NULL, \`freelancerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`job_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`duration\` int NOT NULL DEFAULT '0', \`durationType\` enum ('week', 'month') NOT NULL DEFAULT 'week', \`fileId\` int NULL, \`rate\` int NULL, \`isDraft\` tinyint NOT NULL, \`englishLevel\` enum ('pre-intermediate', 'intermediate', 'upper-intermediate') NOT NULL DEFAULT 'pre-intermediate', \`jobDescription\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`categoryId\` int NULL, \`userId\` int NULL, \`contractId\` int NULL, UNIQUE INDEX \`REL_89a23a65177ee25ca71cdf4a2f\` (\`contractId\`), UNIQUE INDEX \`REL_21c9f1f4078aa5c4e45cbbdbac\` (\`fileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`freelancer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`englishLevel\` varchar(255) NOT NULL, \`position\` varchar(255) NOT NULL, \`rate\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`categoryId\` int NOT NULL, UNIQUE INDEX \`REL_3ecc6951b7f7133932a409a3fb\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('client', 'freelancer', '') NOT NULL DEFAULT '', \`googleId\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`description\` varchar(255) NULL, \`avatarURL\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_f382af58ab36057334fb262efd\` (\`googleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`forgot_password\` (\`id\` int NOT NULL AUTO_INCREMENT, \`link\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_578f17dec4aa5907aa43ed39a0\` (\`link\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proposal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`coverLetter\` varchar(255) NOT NULL, \`bid\` int NOT NULL, \`jobPostId\` int NULL, \`freelancerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`job_post_skills_skill\` (\`jobPostId\` int NOT NULL, \`skillId\` int NOT NULL, INDEX \`IDX_da75e60a1d514422767a088018\` (\`jobPostId\`), INDEX \`IDX_56e603ad9b063928f47e7a110f\` (\`skillId\`), PRIMARY KEY (\`jobPostId\`, \`skillId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`freelancer_skills_skill\` (\`freelancerId\` int NOT NULL, \`skillId\` int NOT NULL, INDEX \`IDX_21b295654e9578456111f72e80\` (\`freelancerId\`), INDEX \`IDX_3d882a5da13cf02e99b1dc984d\` (\`skillId\`), PRIMARY KEY (\`freelancerId\`, \`skillId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_recently_viewed_freelancers_freelancer\` (\`usersId\` int NOT NULL, \`freelancerId\` int NOT NULL, INDEX \`IDX_f8b290f872409f0d11b1b5f6e8\` (\`usersId\`), INDEX \`IDX_0ceb9a088cb0aeca2dedd618e9\` (\`freelancerId\`), PRIMARY KEY (\`usersId\`, \`freelancerId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_saved_freelancers_freelancer\` (\`usersId\` int NOT NULL, \`freelancerId\` int NOT NULL, INDEX \`IDX_4905e52dc9d9d9b6c1efad21e3\` (\`usersId\`), INDEX \`IDX_59f6d9c3a7591a329dcff8c546\` (\`freelancerId\`), PRIMARY KEY (\`usersId\`, \`freelancerId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_hired_freelancers_freelancer\` (\`usersId\` int NOT NULL, \`freelancerId\` int NOT NULL, INDEX \`IDX_5079e28c7adaef86f94c8c9539\` (\`usersId\`), INDEX \`IDX_edf2d74f9af47f13eea27e45b8\` (\`freelancerId\`), PRIMARY KEY (\`usersId\`, \`freelancerId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`education\` ADD CONSTRAINT \`FK_8d5eb71982663cc651f8398bfe6\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`experience\` ADD CONSTRAINT \`FK_06260e04d8ddb6273ed5e819ce9\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_e57b156157d41fa38c1c1cd06d0\` FOREIGN KEY (\`freelancerId\`) REFERENCES \`freelancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` ADD CONSTRAINT \`FK_74b4a0afb8518b85ba868bf8ddb\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` ADD CONSTRAINT \`FK_c8d287835d54bd09f6f3627f56d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` ADD CONSTRAINT \`FK_89a23a65177ee25ca71cdf4a2fd\` FOREIGN KEY (\`contractId\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`job_post\` DROP FOREIGN KEY \`FK_89a23a65177ee25ca71cdf4a2fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP FOREIGN KEY \`FK_c8d287835d54bd09f6f3627f56d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_post\` DROP FOREIGN KEY \`FK_74b4a0afb8518b85ba868bf8ddb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_e57b156157d41fa38c1c1cd06d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`experience\` DROP FOREIGN KEY \`FK_06260e04d8ddb6273ed5e819ce9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`education\` DROP FOREIGN KEY \`FK_8d5eb71982663cc651f8398bfe6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_edf2d74f9af47f13eea27e45b8\` ON \`users_hired_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5079e28c7adaef86f94c8c9539\` ON \`users_hired_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP TABLE \`users_hired_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_59f6d9c3a7591a329dcff8c546\` ON \`users_saved_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4905e52dc9d9d9b6c1efad21e3\` ON \`users_saved_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP TABLE \`users_saved_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0ceb9a088cb0aeca2dedd618e9\` ON \`users_recently_viewed_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f8b290f872409f0d11b1b5f6e8\` ON \`users_recently_viewed_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP TABLE \`users_recently_viewed_freelancers_freelancer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3d882a5da13cf02e99b1dc984d\` ON \`freelancer_skills_skill\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_21b295654e9578456111f72e80\` ON \`freelancer_skills_skill\``,
    );
    await queryRunner.query(`DROP TABLE \`freelancer_skills_skill\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_56e603ad9b063928f47e7a110f\` ON \`job_post_skills_skill\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_da75e60a1d514422767a088018\` ON \`job_post_skills_skill\``,
    );
    await queryRunner.query(`DROP TABLE \`job_post_skills_skill\``);
    await queryRunner.query(`DROP TABLE \`proposal\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_578f17dec4aa5907aa43ed39a0\` ON \`forgot_password\``,
    );
    await queryRunner.query(`DROP TABLE \`forgot_password\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f382af58ab36057334fb262efd\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_3ecc6951b7f7133932a409a3fb\` ON \`freelancer\``,
    );
    await queryRunner.query(`DROP TABLE \`freelancer\``);
    await queryRunner.query(`DROP TABLE \`skill\``);
    await queryRunner.query(
      `DROP INDEX \`REL_21c9f1f4078aa5c4e45cbbdbac\` ON \`job_post\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_89a23a65177ee25ca71cdf4a2f\` ON \`job_post\``,
    );
    await queryRunner.query(`DROP TABLE \`job_post\``);
    await queryRunner.query(`DROP TABLE \`contracts\``);
    await queryRunner.query(`DROP TABLE \`local_file\``);
    await queryRunner.query(`DROP TABLE \`experience\``);
    await queryRunner.query(`DROP TABLE \`education\``);
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
