"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./src/database/db.sqlite3"
        },
        migrations: {
            directory: "./src/database/migrations",
        },
        useNullAsDefault: true
    },
};
module.exports = config;
