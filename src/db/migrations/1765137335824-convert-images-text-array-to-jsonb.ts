import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertImagesTextArrayToJsonb1765137335824
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products
      ALTER COLUMN images
      TYPE jsonb
      USING (
        SELECT jsonb_agg(jsonb_build_object('original', elem))
        FROM unnest(images) AS elem
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products
      ALTER COLUMN images
      TYPE text[]
      USING (
        SELECT array_agg(elem->>'original')
        FROM jsonb_array_elements(images) AS elem
      )
    `);
  }
}
