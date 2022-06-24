import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import SearchResults from "./SearchResults";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const history = useHistory();
  const [phone, setPhone] = useState([]);
  const [search, setSearch] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const changePhoneHandler = (event) => {
    setPhone({ ...phone, mobile_number: event.target.value });
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    console.log("submitting form...", phone);

    if (!phone.mobile_number) {
      window.confirm("Enter a customer's phone number.");
    } else {
      async function searchByPhone() {
        try {
          const responseFromAPI = await searchReservations(
            phone.mobile_number,
            abortController.signal
          );
          if (responseFromAPI.length === 0) {
            setSearch("no results");
          } else {
            setSearch(responseFromAPI);
          }
        } catch (err) {
          setReservationsError(err.message);
        }
      }
      searchByPhone();
    }
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    history.go(-1);
  };

  return (
    <div className="FormContainer">
      <h4>Search Reservations</h4>

      <ErrorAlert error={reservationsError} />

      <form onSubmit={submitFormHandler}>
        <div className="form-group">
          <label>
            <h6>Enter Phone Number</h6>
          </label>
          <input
            className="form-control"
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="000-000-0000"
            value={phone.number}
            onChange={changePhoneHandler}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Find
        </button>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={cancelHandler}
        >
          Cancel
        </button>
      </form>
      <p />
      <p />

      <SearchResults search={search} />

      <p />
    </div>
  );
}

export default Search;
