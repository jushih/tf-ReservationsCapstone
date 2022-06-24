import React from "react";
import { useParams } from "react-router-dom";
import Reservation from "./Reservation";

function ReservationEdit() {
  const { reservation_id } = useParams();

  return (
    <div>
      <Reservation reservation_id={reservation_id} />
    </div>
  );
}

export default ReservationEdit;
