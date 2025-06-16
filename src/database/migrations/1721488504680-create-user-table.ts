import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1721488504680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'character varying',
            length: '50',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'character varying',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'character varying',
            isNullable: false,
          },
          {
            name: 'bio',
            type: 'character varying',
            isNullable: false,
            default: "''",
          },
          {
            name: 'image',
            type: 'character varying',
            isNullable: false,
            default: "''",
          },
          {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'character varying',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_by',
            type: 'character varying',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
