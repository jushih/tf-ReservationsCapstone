import React from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function ReservationEdit() {
  const { reservation_id } = useParams();

  return (
    <div>
      <ReservationForm reservation_id={reservation_id} />
    </div>
  );
}

export default ReservationEdit;
