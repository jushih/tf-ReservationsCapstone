import React, { useState } from "react";
import { finishTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function TablesList({ tables }) {
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  let t = tables;

  const finishHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    let table_id = event.target.value;
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      ) === true
    ) {
    
        finishTable(table_id, abortController.signal)
        .then(() => listTables())
        .catch(err => {setReservationsError(err.message)});

        history.go(0)

      }
  };

  return (
    <div className="ReservationsList">
      <ErrorAlert error={reservationsError} />
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Table Name</th>
              <th scope="col">Status</th>
              <th scope="col">Reservation ID</th>
              <th scope="col">Capacity</th>
              <th scope="col"></th>
            </tr>

            {Object.entries(t).map(([key]) => {
              let table = t[key];
              return (
                <tr key={t[key].table_id}>
                  <td>{t[key].table_name}</td>
                  <td data-table-id-status={table.table_id}>{t[key].reservation_id === null ? "Free" : "Occupied"}</td>
                  <td data-table-id-status={table.table_id}>{t[key].reservation_id}</td>
                  <td>{t[key].capacity}</td>

                  {t[key].reservation_id === null ? null : (
                    <td>
                      <button
                        data-table-id-finish={table.table_id}
                        value={table.table_id}
                        className="btn btn-danger"
                        onClick={finishHandler}
                      >
                        Finish
                      </button>
                    </td>
                  )}
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

export default TablesList;
