import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableRefactor1663842399935 implements MigrationInterface {
  name = 'TableRefactor1663842399935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b61e944e4f72458a7cd75e5902\` ON \`contracts\` (\`offerId\`)`,
    );
  }
}
