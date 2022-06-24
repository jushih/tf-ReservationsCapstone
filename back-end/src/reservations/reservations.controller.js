const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */

// validation fields
function hasFields(req, res, next) {
  const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;

  if (
    first_name &&
    last_name &&
    mobile_number &&
    reservation_date &&
    reservation_time &&
    people
  ) {
    return next();
  } else if (!first_name || !last_name) {
    next({ status: 400, message: "first_name or last_name is missing." });
  } else if (!mobile_number) {
    next({ status: 400, message: "mobile_number is missing." });
  } else if (!reservation_date) {
    next({ status: 400, message: "reservation_date is missing." });
  } else if (!reservation_time) {
    next({ status: 400, message: "reservation_time is missing." });
  } else if (!people) {
    next({ status: 400, message: "people is missing." });
  } else if (people <= 0) {
    next({ status: 400, message: "people must be greater than zero." });
  } else {
    next({ status: 400, message: "Error." });
  }
}

// validate reservation id exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  
  if (data) {
    res.locals.reservation = data
    return next()
  }
  else {
    next({ status: 404, message: `Reservation id does not exist: ${reservationId}` });
  }
  
}

// validate time
function validateHours(req, res, next) {
  const { reservation_time } = req.body.data;
  const open = 1030;
  const close = 2130;
  const reserveTime = parseInt(reservation_time.replace(":",""))
  
  if (reserveTime > open && reserveTime < close) {
    return next();
  }
  else {
    return next({
      status: 400,
      message: `reservation_time: ${reservation_time} must be between 10:30am and 9:30pm.`,
    });
  }
}

// validate reservation date is not a tuesday, or in the past
function validateDay(req, res, next) {
  const { reservation_date } = req.body.data;
  const weekday = new Date( reservation_date).getUTCDay()
  const reserveDay = new Date(reservation_date).getTime()
  const today = new Date()

  if(weekday === 2 && reserveDay < today) {
    return next({
      status: 400,
      message: "Reservations must be in the future. The restaurant is closed on Tuesdays.",
    });
  }
  else if(weekday ===2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }
  else if(reserveDay < today) {
    return next({
      status: 400,
      message: "Reservations must be in the future.",
    });
  }
  else {
    return next();
  }
}


function validatePhone(req, res, next) {
  const { mobile_number } = req.body.data;
  const regex = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  //console.log('test',regex.test(mobile_number))
  if (regex.test(mobile_number) === true) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `Phone number ${mobile_number} must be in valid format.`,
    });
  }
}


// validate people is a number
function validatePeopleType(req, res, next) {
  const { people } = req.body.data;

  if (Number.isInteger(people)) {
      return next();
  } else {
      return next({
          status: 400, 
          message: `people field ${people} must be a number.`
      });
  }
}

// validate reservaton date is valid 
function validateDateFormat(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (date && date > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_date field ${reservation_date} is not in correct format.`,
    });
  }
}

// validate time is correctly formatted
function validateTimeFormat(req, res, next) {
  const { reservation_time } = req.body.data;
  const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
  if (regex.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `reservation_time field ${reservation_time} is not in correct format.`,
    });
  }
}


// validate reservation status is booked before creating new reservation
function validateBooked(req, res, next) {
  const { status } = req.body.data;
    if (!status || status.toLowerCase() === "booked") {
      return next();
    } else {
      return next({
        status: 400, 
        message: `Invalid status: ${status}`,
      });
    }
  
}

// validate reservation status fields are valid before updating reservation
function validateStatus(req, res, next) {

  const { status } = req.body.data;
  //console.log('status',status)
    if (status.toLowerCase() === "booked" || status.toLowerCase() === 'seated' || status.toLowerCase() === 'finished' || status.toLowerCase() ==='cancelled') {
      res.locals.status = status
      return next();
    } 
    
    else {
      return next({
        status: 400, 
        message: `Unknown status: ${status}`,
      });
    }
  
}

// validate existing reservation status is not finished before updating reservation
function validateUnfinished(req, res, next) {
    if (res.locals.reservation.status.toLowerCase() === 'finished') {
      return next({
        status: 400, 
        message: `A finished reservation cannot be updated.`,
      });
    } 
    else {
      return next();
    }
  
}


async function list(req, res) {
  const { mobile_number, date } = req.query;


  // filter reservation by phone number or date
  if (mobile_number) {
    const data = await service.search(mobile_number);
    //console.log(data)
    res.status(201).json({ data: data});
    }
   else if (date) {
      const data = await service.listByDate(date);
      res.json({ data: data});
      }
  else {
    const data = await service.list();
    res.json({ data: data});
  }
  
}


// reads reservation 
async function read(req, res) {
  res.json({ data: res.locals.reservation });
  
}

// updates reservation
async function update(req, res) {
  const { reservation } = res.locals;
  const { data } = req.body;
  //console.log('reservation',req.body.data)

  const updatedReservation = {
    ...reservation,
    ...data
  }

  const updatedData = await service.update(updatedReservation);
  res.json({ data: updatedData });
  
}


// cancels reservation
async function updateStatus(req, res) {

  const { reservation, status } = res.locals;
  const updatedReservation = {
    ...reservation,
    status: status
  }

  const data = await service.update(updatedReservation);
  res.json({ data: data });
  
}

async function create(req, res) {
  const newReservation = {
    ...req.body.data
  }
  const data = await service.create(newReservation);
  res.status(201).json({ data: data });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasFields, validateHours, validateDay, validateDateFormat, validateTimeFormat, validatePeopleType, validatePhone, validateBooked, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [hasFields, reservationExists, validateHours, validateDay, validateDateFormat, validateTimeFormat, validatePeopleType, validatePhone, asyncErrorBoundary(update)],
  updateStatus: [reservationExists, validateStatus, validateUnfinished, asyncErrorBoundary(updateStatus)],

};
