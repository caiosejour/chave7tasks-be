"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.string('id').primary().notNullable();
        table.string('name').notNullable();
        table.string('surName');
        table.string('photoUrl');
    });
}
async function down(knex) {
    await knex.schema.dropTable('users');
}
