import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables } from "../utils/api";
import SeatList from "./SeatList";

function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function loadTables() {
      try {
        const tablesResponse = listTables();
        const tablesFromAPI = await tablesResponse;
        //console.log('reserves',reservesFromAPI)
        setTables(tablesFromAPI);
      } catch (error) {
        console.log("Read error: ", error);
      }
    }
    loadTables();
  }, []);

  const cancelHandler = async (event) => {
    event.preventDefault();
    history.go(-1);
  };

  return (
    <div className="FormContainer">
      <h4>Assign Seat</h4>

      <SeatList tables={tables} reservation_id={reservation_id} />

      <button
        type="button"
        class="btn btn-secondary mr-2"
        onClick={cancelHandler}
      >
        Cancel
      </button>
    </div>
  );
}

export default Seat;
