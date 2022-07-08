import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatList({ tables, reservation_id }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const [tableId, setTableId] = useState([]);
  let t = tables;

  const cancelHandler = async (event) => {
    event.preventDefault();
    history.go(-1);
  };

  const changeSeatHandler = (event) => {
    setTableId(event.target.value);
    //console.log(tableId)
  };

  const seatHandler = async (event) => {
    event.preventDefault();
    try {
      //console.log('submit',tableId);
      await seatTable(tableId, reservation_id);
      history.push(`/dashboard`)
      
    } catch (err) {
      setReservationsError(err.message);
    }
  };

  return (
    <div className="ReservationsList">
      <ErrorAlert error={reservationsError} />


      <form onSubmit={seatHandler}>
      <select  name="table_id" className="form-control" onChange={changeSeatHandler}>
        <option defaultValue>Select a seat...</option>

        {Object.entries(t).map(([key, value]) => {
          let table = t[key];
          return (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          );
        })}
      </select>
      <p />

      <button className="btn btn-primary" type="submit">
        Submit
      </button>

      <button
        type="button"
        className="btn btn-secondary mr-2"
        onClick={cancelHandler}
      >
        Cancel
      </button>

      </form>

    </div>
  );
}

export default SeatList;
