import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertImagesTextArrayToJsonb1765137335824
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar columna temporal de tipo jsonb.
    await queryRunner.query(`
        ALTER TABLE "products" ADD COLUMN "images_jsonb_temp" jsonb;
    `);

    // 2. Copiar los datos transformados de text[] a jsonb.
    await queryRunner.query(`
        UPDATE "products"
        SET "images_jsonb_temp" = (
            SELECT jsonb_agg(jsonb_build_object('original', elem))
            FROM unnest("images") AS elem
        )
        WHERE "images" IS NOT NULL;
    `);

    // 3. Eliminar la columna antigua (text[]).
    await queryRunner.query(`
        ALTER TABLE "products" DROP COLUMN "images";
    `);

    // 4. Renombrar la columna temporal a 'images'.
    await queryRunner.query(`
        ALTER TABLE "products" RENAME COLUMN "images_jsonb_temp" TO "images";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Para el down, se revertiría el proceso
    await queryRunner.query(`
          ALTER TABLE "products" ADD COLUMN "images_text_array_temp" text[];
      `);

    await queryRunner.query(`
          UPDATE "products"
          SET "images_text_array_temp" = (
              SELECT array_agg(elem->>'original')
              FROM jsonb_array_elements("images") AS elem
          )
          WHERE "images" IS NOT NULL;
      `);

    await queryRunner.query(`
          ALTER TABLE "products" DROP COLUMN "images";
      `);

    await queryRunner.query(`
          ALTER TABLE "products" RENAME COLUMN "images_text_array_temp" TO "images";
      `);
  }
}
