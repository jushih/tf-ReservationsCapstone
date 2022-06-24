const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .then((selectedRecords) => selectedRecords[0]);
}

function seat(table) {
  return knex("tables")
    .select("*")
    .where({ table_id: table.table_id })
    .update(table, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function finish(table) {
  return knex("tables")
    .select("*")
    .where({ table_id: table.table_id })
    .update(table, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  create,
  read,
  seat,
  finish,
};
