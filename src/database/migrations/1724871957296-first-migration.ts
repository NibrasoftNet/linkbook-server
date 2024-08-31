import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1724871957296 implements MigrationInterface {
  name = 'FirstMigration1724871957296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "country" character varying NOT NULL, "city" character varying NOT NULL, "longitude" double precision NOT NULL, "latitude" double precision NOT NULL, "country_flag" character varying, "street" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" character varying NOT NULL, "description" character varying NOT NULL, "store_unique_code" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "image_id" uuid, "address_id" integer, CONSTRAINT "UQ_22fbc81f50d2296ffe1ce2506c6" UNIQUE ("store_unique_code"), CONSTRAINT "REL_36605697bf2bb48490037ca84f" UNIQUE ("image_id"), CONSTRAINT "REL_f3eb3afc763da3076e80e2459d" UNIQUE ("address_id"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store_admin" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "admin_type" character varying NOT NULL DEFAULT 'ADMIN', "store_id" integer, "tenant_id" integer, CONSTRAINT "PK_30b9f4a4d383b7e067b39a29eaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "image_id" uuid, CONSTRAINT "REL_dc252738f70366595ac88f5a98" UNIQUE ("image_id"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_type_enum" AS ENUM('DONATIONS', 'SWAPS', 'PURCHASES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "stock" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "description" character varying, "type" "public"."product_type_enum" NOT NULL DEFAULT 'PURCHASES', "brand" character varying, "modal" character varying, "size" integer NOT NULL DEFAULT '0', "category_id" integer NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applicant_to_donation" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'PENDING', "donation_id" integer, "applicant_id" integer, CONSTRAINT "PK_96912d97643cc9155a49bd50325" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donation" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "active" boolean NOT NULL DEFAULT true, "creator_id" integer, "product_id" integer NOT NULL, "address_id" integer NOT NULL, CONSTRAINT "REL_a3a5dc0ed1d8185a33d9ee4d5f" UNIQUE ("product_id"), CONSTRAINT "REL_8e8c4837ff3e7700e596d2ef1b" UNIQUE ("address_id"), CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "social_id" character varying, "first_name" character varying, "last_name" character varying, "phone" character varying, "deleted_at" TIMESTAMP, "is_new_user" boolean NOT NULL DEFAULT true, "photo_id" uuid, "role_id" integer, "status_id" integer, "address_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "REL_302d96673413455481d5ff4022" UNIQUE ("address_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0cd76a8cdee62eeff31d384b73" ON "user" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
    );
    await queryRunner.query(
      `CREATE TABLE "swap" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "description" character varying, "active" boolean NOT NULL DEFAULT true, "address_id" integer NOT NULL, "product_id" integer, CONSTRAINT "REL_70262b53eded9704d98d5a87c7" UNIQUE ("address_id"), CONSTRAINT "REL_fb2b544194e1d35c4fe79f81b7" UNIQUE ("product_id"), CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "hash" character varying NOT NULL, "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30e98e8746699fb9af235410af" ON "session" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "search_history" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "brand" character varying, "model" character varying, "color" character varying, "reference_number" character varying, "image_url" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_cb93c8f85dbdca85943ca494812" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "expire_in" bigint NOT NULL, "otp" character varying NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applicant_to_swap" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_be29224de8856caadd70aec2c58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_image_file" ("product_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_1d2a982a5f47afabaea5dd441c6" PRIMARY KEY ("product_id", "file_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a59b6d136c6e7eaf61f22f3f4" ON "product_image_file" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_223ffd0c23037df1f55ecb182a" ON "product_image_file" ("file_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_36605697bf2bb48490037ca84f5" FOREIGN KEY ("image_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_f3eb3afc763da3076e80e2459dd" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_admin" ADD CONSTRAINT "FK_718d4f5da12f0c830e6029a8b23" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_admin" ADD CONSTRAINT "FK_2b5e671b4f35cf8607999a45858" FOREIGN KEY ("tenant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_dc252738f70366595ac88f5a98f" FOREIGN KEY ("image_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_donation" ADD CONSTRAINT "FK_30ae4047364d83c2a783a3f077f" FOREIGN KEY ("donation_id") REFERENCES "donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_donation" ADD CONSTRAINT "FK_306dd6013fc34033250219a502b" FOREIGN KEY ("applicant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" ADD CONSTRAINT "FK_be6b340c20f2d5eb406fc5111af" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" ADD CONSTRAINT "FK_a3a5dc0ed1d8185a33d9ee4d5f0" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" ADD CONSTRAINT "FK_8e8c4837ff3e7700e596d2ef1bd" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_892a2061d6a04a7e2efe4c26d6f" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_302d96673413455481d5ff4022a" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_70262b53eded9704d98d5a87c73" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_fb2b544194e1d35c4fe79f81b7d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" ADD CONSTRAINT "FK_d1ebf4101b2804213251e0a04d2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_image_file" ADD CONSTRAINT "FK_4a59b6d136c6e7eaf61f22f3f4d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_image_file" ADD CONSTRAINT "FK_223ffd0c23037df1f55ecb182ae" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_image_file" DROP CONSTRAINT "FK_223ffd0c23037df1f55ecb182ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_image_file" DROP CONSTRAINT "FK_4a59b6d136c6e7eaf61f22f3f4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "search_history" DROP CONSTRAINT "FK_d1ebf4101b2804213251e0a04d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_fb2b544194e1d35c4fe79f81b7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_70262b53eded9704d98d5a87c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_302d96673413455481d5ff4022a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_892a2061d6a04a7e2efe4c26d6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" DROP CONSTRAINT "FK_8e8c4837ff3e7700e596d2ef1bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" DROP CONSTRAINT "FK_a3a5dc0ed1d8185a33d9ee4d5f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" DROP CONSTRAINT "FK_be6b340c20f2d5eb406fc5111af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_donation" DROP CONSTRAINT "FK_306dd6013fc34033250219a502b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_to_donation" DROP CONSTRAINT "FK_30ae4047364d83c2a783a3f077f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_dc252738f70366595ac88f5a98f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_admin" DROP CONSTRAINT "FK_2b5e671b4f35cf8607999a45858"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_admin" DROP CONSTRAINT "FK_718d4f5da12f0c830e6029a8b23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_f3eb3afc763da3076e80e2459dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_36605697bf2bb48490037ca84f5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_223ffd0c23037df1f55ecb182a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a59b6d136c6e7eaf61f22f3f4"`,
    );
    await queryRunner.query(`DROP TABLE "product_image_file"`);
    await queryRunner.query(`DROP TABLE "applicant_to_swap"`);
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TABLE "search_history"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30e98e8746699fb9af235410af"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "swap"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e1f623798118e629b46a9e629"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0cd76a8cdee62eeff31d384b73"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "donation"`);
    await queryRunner.query(`DROP TABLE "applicant_to_donation"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."product_type_enum"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "store_admin"`);
    await queryRunner.query(`DROP TABLE "store"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
