import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatList({ tables, reservation_id }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  let t = tables;

  const seatHandler = async (event) => {
    event.preventDefault();
    try {
      const table_id = event.target.value;
      await seatTable(table_id, reservation_id);
      history.go(-1);
    } catch (err) {
      setReservationsError(err.message);
    }
  };

  return (
    <div className="ReservationsList">
      <ErrorAlert error={reservationsError} />
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Table Name</th>
              <th scope="col">Status</th>
              <th scope="col">Capacity</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>

            {Object.entries(t).map(([key, value]) => {
              let table = t[key];
              return (
                <tr>
                  <td>{t[key].table_name}</td>
                  <td>{t[key].status}</td>
                  <td>{t[key].capacity}</td>
                  <td>
                    <Link to={`/tables/${table.table_id}/seat`}>
                      <button
                        href={`/tables/${table.table_id}/seat`}
                        class="btn btn-primary"
                        value={table.table_id}
                        onClick={seatHandler}
                      >
                        Submit
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}

export default SeatList;
