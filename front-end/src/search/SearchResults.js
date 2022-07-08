import React from "react";
import ReservationsList from "../reservations/ReservationsList";

function SearchResults(search) {
  if (!search["search"].length) {
    return null;
  } else if (search["search"] === "no results") {
    return (
      <div className="FormContainer">
        <br />
        <h4>
          <i>No reservations found</i>
        </h4>
      </div>
    );
  } else if (search["search"].length > 0) {
    return (
      <div>
        <ReservationsList reservations={search["search"]} search={true} />
      </div>
    );
  }
}

export default SearchResults;
