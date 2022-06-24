import React from "react";
import { Link } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

function DateControls({ date }) {
  return (
    <div className="DateControls">
      <Link to={`/dashboard?date=${previous(date)}`}>
        <button type="submit" class="btn btn-dark">
          Previous
        </button>
      </Link>
      <Link to={`/dashboard?date=${today(date)}`}>
        <button type="submit" class="btn btn-dark">
          Today
        </button>
      </Link>
      <Link to={`/dashboard?date=${next(date)}`}>
        <button type="submit" class="btn btn-dark">
          Next
        </button>
      </Link>
    </div>
  );
}

export default DateControls;
