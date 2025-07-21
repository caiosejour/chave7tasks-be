import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('users', (table) => {

        table.string('id').primary().notNullable();
        table.string('name').notNullable();
        table.string('surName');
        table.string('photoUrl');

    });

}

export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('users');

}

