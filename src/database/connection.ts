import knex from 'knex'
const knexConfigs = require('./../../knexfile');

const connection = knex(knexConfigs.development);

module.exports = connection