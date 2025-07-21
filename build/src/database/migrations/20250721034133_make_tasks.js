"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTable('tasks');
}
