import React, { useEffect, useState } from "react";
import {
  createReservation,
  lookupReservations,
  updateReservation,
} from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Reservation({ reservation_id }) {
  // defines whether the form is a create form or an edit form
  let flow = "Create";
  if (!reservation_id) {
    flow = "Create";
  } else {
    flow = "Edit";
  }

  const history = useHistory();

  const initialReserveState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialReserveState });
  const [reservationsError, setReservationsError] = useState(null);

  // if editing, retrieve information for existing reservation
  useEffect(() => {
    async function loadDashboard() {
      const abortController = new AbortController();

      try {
        const reserveResponse = lookupReservations(reservation_id);
        const reserveFromAPI = await reserveResponse;
        setReservation(reserveFromAPI);
      } catch (error) {
        console.log("Read error: ", error);
      }

      return () => abortController.abort();
    }
    loadDashboard();
  }, [reservation_id]);

  const changeHandler = (event) => {
    if (event.target.name === "reservation_date") {
      const weekday = new Date(event.target.value).getUTCDay();
      const reserveDay = new Date(event.target.value).getTime();
      const today = new Date();

      if (weekday === 2 && reserveDay < today) {
        setReservationsError(
          "Reservations must be in the future. The restaurant is closed on Tuesdays."
        );
      } else if (weekday === 2) {
        setReservationsError("The restaurant is closed on Tuesdays.");
      } else if (reserveDay < today) {
        setReservationsError("Reservations must be in the future.");
      } else {
        setReservationsError(null);
      }
    }

    if (event.target.name === "reservation_time") {
      const open = 1030;
      const close = 2130;
      const reserveTime = parseInt(event.target.value.replace(":", ""));

      if (reserveTime > open && reserveTime < close) {
        setReservationsError(null);
      } else {
        setReservationsError(
          "reservation_time must be between 10:30am and 9:30pm."
        );
      }
    }

    if (event.target.name === "people") {
      console.log("people", event.target.value);
      setReservation({
        ...reservation,
        [event.target.name]: parseInt(event.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [event.target.name]: event.target.value,
      });
    }
  };

  const SubmitFormHandler = async (event) => {
    event.preventDefault();

    //create a new reservation
    if (flow === "Create") {
      console.log(reservation);

      createReservation(reservation)
      .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
      .catch(err => {setReservationsError(err.message)})
            
    }
    //edit a reservation
    else if (flow === "Edit") {

      updateReservation(reservation)
      .then(() => history.go(0))
      .catch(err => {setReservationsError(err.message)})

    } else {
      console.log("Invalid flow.");
    }
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    history.go(-1);
  };

  return (
    <div className="FormContainer">
      <h4>{flow} Reservation</h4>

      <ErrorAlert error={reservationsError} />

      <form onSubmit={SubmitFormHandler}>
        <div className="form-group">
          <label>
            <h6>First Name</h6>
          </label>
          <input
            class="form-control"
            name="first_name"
            id="first_name"
            type="text"
            placeholder="First Name"
            value={reservation.first_name}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Last Name</h6>
          </label>
          <input
            class="form-control"
            name="last_name"
            id="last_name"
            type="text"
            placeholder="Last Name"
            value={reservation.last_name}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Phone Number</h6>
          </label>
          <input
            class="form-control"
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="000-000-0000"
            value={reservation.mobile_number}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Reservation Date</h6>
          </label>
          <input
            class="form-control"
            name="reservation_date"
            id="reservation_date"
            type="date"
            value={reservation.reservation_date}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Reservation Time</h6>
          </label>
          <input
            class="form-control"
            name="reservation_time"
            id="reservation_time"
            type="time"
            value={reservation.reservation_time}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Party Number</h6>
          </label>
          <input
            class="form-control"
            name="people"
            id="people"
            type="number"
            min="1"
            value={reservation.people}
            onChange={changeHandler}
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Submit
        </button>

        <button
          type="button"
          class="btn btn-secondary mr-2"
          onClick={cancelHandler}
        >
          Cancel
        </button>
      </form>
      <p />
      <p />
    </div>
  );
}

export default Reservation;
