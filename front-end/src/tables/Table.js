import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Table() {
  const history = useHistory();
  const [table, setTable] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const changeNameHandler = (event) => {
    setTable({ ...table, table_name: event.target.value });
  };

  const changeCapacityHandler = (event) => {
    setTable({ ...table, capacity: parseInt(event.target.value) });
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    //console.log("submitting form...", table);

    createTable(table)
    .then(() => history.push('/'))
    .catch(err => {setReservationsError(err.message)})

    /*
    if (!table.table_name || !table.capacity) {
      window.confirm("Please enter all fields.");
    } else {

      createTable(table)
      .then(() => history.push('/'))
      .catch(err => {setReservationsError(err.message)})

    }
    */
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    history.go(-1);
  };

  return (
    <div className="FormContainer">
      <h4>New Table</h4>

      <ErrorAlert error={reservationsError} />

      <form onSubmit={submitFormHandler}>
        <div className="form-group">
          <label>
            <h6>Table Name</h6>
          </label>
          <input
            class="form-control"
            name="table_name"
            id="name"
            type="text"
            placeholder="Table Name"
            value={table.table_name}
            minLength="2"
            onChange={changeNameHandler}
          />
        </div>

        <div className="form-group">
          <label>
            <h6>Capacity</h6>
          </label>
          <input
            class="form-control"
            name="capacity"
            id="capacity"
            type="number"
            min="1"
            value={table.capacity}
            onChange={changeCapacityHandler}
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Add
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

export default Table;
