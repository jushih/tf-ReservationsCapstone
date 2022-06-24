import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesList({ tables }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  let t = tables;

  const finishHandler = async (event) => {
    event.preventDefault();
    let table_id = event.target.value;
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      ) === true
    ) {
      try {
        await finishTable(table_id);
        history.go(0);
      } catch (err) {
        setReservationsError(err.message);
      }
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
              <th scope="col">Capacity</th>
              <th scope="col"></th>
            </tr>

            {Object.entries(t).map(([key]) => {
              let table = t[key];
              return (
                <tr key={t[key].table_id}>
                  <td>{t[key].table_name}</td>
                  <td>{t[key].status}</td>
                  <td>{t[key].capacity}</td>

                  {t[key].status === "Free" ? null : (
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
