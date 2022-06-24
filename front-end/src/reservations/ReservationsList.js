import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsList({ reservations, date, search }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  let r = reservations;
  let renderTable = false;

  const cancelHandler = async (event) => {
    event.preventDefault();
    let reservation_id = event.target.value;
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      ) === true
    ) {
      try {
        await updateStatus(reservation_id, "cancelled");
        history.go(0);
      } catch (err) {
        setReservationsError(err.message);
      }
    }
  };

  // renders table if there are reservations on that date or if there are search results
  if (date) {
    for (const [key] of Object.entries(r)) {
      if (date === r[key].reservation_date) {
        renderTable = true;
      }
      //console.log(key, r[key].first_name + " " + r[key].last_name);
    }
  } else if (search) {
    renderTable = true;
  }

  if (renderTable === true) {
    return (
      <div className="ReservationsList">
        <ErrorAlert error={reservationsError} />
        <div class="table-responsive-sm w-80 d-block d-sm-table">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Reservation Date</th>
                <th scope="col">Reservation Time</th>
                <th scope="col">Party</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>

              {Object.entries(r).map(([key]) => {
                if (date === r[key].reservation_date || search) {
                  let reservation_id = r[key].reservation_id;
                  // capitalize first letter of status
                  let status =
                    r[key].status.charAt(0).toUpperCase() +
                    r[key].status.slice(1);
                  return (
                    <tr>
                      <td>{r[key].first_name + " " + r[key].last_name}</td>
                      <td>{r[key].mobile_number}</td>
                      <td>{r[key].reservation_date}</td>
                      <td>{r[key].reservation_time}</td>
                      <td>{r[key].people}</td>
                      <td>{status}</td>

                      {status === "booked" ? (
                        <div>
                          <td>
                            <Link to={`/reservations/${reservation_id}/seat`}>
                              <button
                                href={`/reservations/${reservation_id}/seat`}
                                class="btn btn-primary"
                              >
                                Seat
                              </button>
                            </Link>
                          </td>
                          <td>
                            <Link to={`/reservations/${reservation_id}/edit`}>
                              <button
                                href={`/reservations/${reservation_id}/edit`}
                                class="btn btn-primary"
                              >
                                Edit
                              </button>
                            </Link>
                          </td>
                          <td>
                            <button
                              data-reservation-id-cancel={reservation_id}
                              value={reservation_id}
                              type="submit"
                              class="btn btn-danger"
                              onClick={cancelHandler}
                            >
                              Cancel
                            </button>
                          </td>
                        </div>
                      ) : null}
                    </tr>
                  );
                }
              })}
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="FormContainer">
        <br />
        <h4>
          <i>No reservations on this date.</i>
        </h4>
      </div>
    );
  }
}

export default ReservationsList;
