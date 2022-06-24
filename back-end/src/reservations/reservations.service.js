const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*");
}

function listByDate(date) {
  //console.log('list query')
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .andWhereNot({ status: "cancelled" })
    .andWhereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function read(reservation_id) {
  //console.log('read query',reservation_id)
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .then((selectedRecords) => selectedRecords[0]);
}

function create(newReservation) {
  //console.log('create query')
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function update(reservation) {
  //console.log('update query',reservation)
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
  search,
};
