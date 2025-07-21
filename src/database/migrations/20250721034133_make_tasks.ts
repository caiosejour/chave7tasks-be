import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('tasks', (table) => {

        table.string('id').primary().notNullable();
        table.string('title').notNullable();
        table.string('description');
        table.string('ownerId').notNullable();
        table.string('type').notNullable();
        table.string('status').notNullable();
        table.string('createdAt').notNullable();

    });

}

export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTable('tasks');

}

