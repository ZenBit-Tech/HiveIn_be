import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProposalFiles1666068566383 implements MigrationInterface {
  name = 'ProposalFiles1666068566383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3e1f52ec904aed992472f2be14\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\``,
    );
    await queryRunner.query(`ALTER TABLE \`proposal\` ADD \`fileId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD UNIQUE INDEX \`IDX_ce88bcebeb35606a63a04bfa9f\` (\`fileId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_ce88bcebeb35606a63a04bfa9f\` ON \`proposal\` (\`fileId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` ADD CONSTRAINT \`FK_ce88bcebeb35606a63a04bfa9f8\` FOREIGN KEY (\`fileId\`) REFERENCES \`local_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`proposal\` DROP FOREIGN KEY \`FK_ce88bcebeb35606a63a04bfa9f8\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_ce88bcebeb35606a63a04bfa9f\` ON \`proposal\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proposal\` DROP INDEX \`IDX_ce88bcebeb35606a63a04bfa9f\``,
    );
    await queryRunner.query(`ALTER TABLE \`proposal\` DROP COLUMN \`fileId\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\` (\`offerId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_3e1f52ec904aed992472f2be14\` ON \`users\` (\`avatarId\`)`,
    );
  }
}
