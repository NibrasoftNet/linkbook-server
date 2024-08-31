import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSwaps1725135887044 implements MigrationInterface {
  name = 'AddSwaps1725135887044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD "swap_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD "product_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD CONSTRAINT "UQ_6e2335e86fd252ad558da9bae36" UNIQUE ("product_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD "applicant_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE "swap" ADD "creator_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD CONSTRAINT "FK_88383d77582bd428bba1b6472a7" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD CONSTRAINT "FK_6e2335e86fd252ad558da9bae36" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" ADD CONSTRAINT "FK_428b77efdf895328d00ba90071f" FOREIGN KEY ("applicant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_016ee8e85157cce1e8333c59268" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_016ee8e85157cce1e8333c59268"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP CONSTRAINT "FK_428b77efdf895328d00ba90071f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP CONSTRAINT "FK_6e2335e86fd252ad558da9bae36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP CONSTRAINT "FK_88383d77582bd428bba1b6472a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "creator_id"`);
    await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "quantity"`);
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP COLUMN "applicant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP CONSTRAINT "UQ_6e2335e86fd252ad558da9bae36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP COLUMN "swap_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_swap" DROP COLUMN "quantity"`,
    );
  }
}
