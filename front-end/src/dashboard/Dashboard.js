import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import DateControls from "./DateControls";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const reservesResponse = listReservations({ date });
        const reservesFromAPI = await reservesResponse;
        //console.log('reserves',reservesFromAPI)
        setReservations(reservesFromAPI);
      } catch (error) {
        console.log("Read error: ", error);
      }
    }
    loadDashboard();
  }, [date]);

  useEffect(() => {
    async function loadTables() {
      try {
        const tablesResponse = listTables();
        const tablesFromAPI = await tablesResponse;
        //console.log(tablesFromAPI)
        setTables(tablesFromAPI);
      } catch (error) {
        console.log("Read error: ", error);
      }
    }
    loadTables();
  }, [date]);
  //console.log('reserves',reservations)

  return (
    <main>
      <div className="FormContainer">
        <h2>Dashboard</h2>
        <div className="d-md-flex mb-3">
          <h5 className="mb-0">Reservations for {date}</h5>
        </div>
        <DateControls date={date} />
      </div>
      <ReservationsList reservations={reservations} date={date} />
      <div>
        <br />
        <div className="FormContainer">
          <h5 className="mb-0">Tables</h5>
        </div>
        <TablesList tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
