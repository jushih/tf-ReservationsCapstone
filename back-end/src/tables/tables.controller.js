const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for tables resources
 */

// validation function

function hasFields(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;

  if (table_name && table_name.length >= 2 && capacity) {
    return next();
  } else if (!table_name) {
    next({ status: 400, message: "table_name is missing." });
  } else if (!capacity) {
    next({ status: 400, message: "capacity is missing." });
  } else if (!table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be at least two characters long.",
    });
  } else {
    next({ status: 400, message: "Error." });
  }
}

// validate reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data || {};

  if (reservation_id === undefined) {
    return next({
      status: 400,
      message: `reservation_id is missing.`,
    });
  }

  const data = await reservationService.read(reservation_id);

  if (!data) {
    return next({
      status: 404,
      message: `reservation_id: ${reservation_id} does not exist.`,
    });
  } else if (data.status.toLowerCase() === "seated") {
    return next({
      status: 400,
      message: `reservation_id: ${reservation_id} is seated already.`,
    });
  } else {
    res.locals.reservation = data;
    return next();
  }
}

// validate capacity is a number
function validateCapacityType(req, res, next) {
  const { capacity } = req.body.data;
  if (Number.isInteger(capacity)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `capacity field ${capacity} must be a number.`,
    });
  }
}

// validate table exists
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const data = await service.read(table_id);
  if (data) {
    res.locals.table = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `table_id does not exist: ${table_id}.`,
    });
  }
}

// validate table is not occupied
function validateOccupancy(req, res, next) {
  const { status } = res.locals.table;
  if (status.toLowerCase() === "occupied") {
    return next();
  } else {
    return next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
}

function validateFreeTable(req, res, next) {
  const { status } = res.locals.table;
  if (status.toLowerCase() === "free") {
    return next();
  } else {
    return next({
      status: 400,
      message: "Table is occupied.",
    });
  }
}

// validate table capacity
function validateCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity >= people) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Table does not have enough capacity.",
    });
  }
}

// seat a reservation at a table
async function seat(req, res) {
  const { table } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const { table_id } = req.params;
  const updatedTable = {
    ...table,
    table_id: table_id,
    reservation_id: reservation_id,
    status: "Occupied",
  };
  const data = await service.seat(updatedTable);

  // set reservation status to "seated" using reservation id
  const updatedReservation = {
    status: "seated",
    reservation_id: reservation_id,
  };
  await reservationService.update(updatedReservation);
  res.json({ data: data });
}

// finishes table
async function finish(req, res) {
  const { table } = res.locals;

  const updatedTable = {
    ...table,
    status: "Free",
  };

  const data = await service.finish(updatedTable);
  res.json({ data: data });

  // set reservation status to "finished"
  const updatedReservation = {
    status: "finished",
    reservation_id: table.reservation_id,
  };

  await reservationService.update(updatedReservation);
  res.json({ data: data });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function create(req, res) {
  const newTable = {
    ...req.body.data,
    status: "Free",
  };
  const data = await service.create(newTable);
  res.status(201).json({ data: data });
}

module.exports = {
  list,
  create: [hasFields, validateCapacityType, asyncErrorBoundary(create)],
  seat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    validateCapacity,
    validateFreeTable,
    asyncErrorBoundary(seat),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    validateOccupancy,
    asyncErrorBoundary(finish),
  ],
};
