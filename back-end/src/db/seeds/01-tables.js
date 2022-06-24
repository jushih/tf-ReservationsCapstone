const json = require('./01-tables.json')

exports.seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE");
  return knex("tables").insert(json);
};
