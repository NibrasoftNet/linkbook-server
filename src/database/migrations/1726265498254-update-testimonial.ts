import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTestimonial1726265498254 implements MigrationInterface {
    name = 'UpdateTestimonial1726265498254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "testimonial" RENAME COLUMN "description" TO "comment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "testimonial" RENAME COLUMN "comment" TO "description"`);
    }

}
