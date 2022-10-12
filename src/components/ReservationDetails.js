import React, { useState } from "react";
import axios from "axios";
import { useReservationsContext } from "../hooks/useReservationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { PROD_RES_URL, PROD_USER_URL } from "../utils/URLs";
import ReservationForm from "./ReservationForm";

const ReservationDetails = (props) => {
  const { reservation, index } = props;
  const { user } = useAuthContext();
  const { state, dispatch } = useReservationsContext();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formatAMPM = (timeString) => {
    timeString = timeString.split(":");
    let hours = timeString[0];
    let minutes = timeString[1];
    const ampm = hours >= 12 ? "pm" : "am";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `${minutes}` : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;

    return strTime;
  };

  const { _id, name, unit, timeFrom, timeTo, user_id } = reservation;
  let date = new Date(reservation.date);
  date.setDate(date.getDate() + 1);

  const modifyReservation = () => {
    dispatch({ type: "SEt_RESERVATION", payload: reservation });
  };
  const deleteReservation = (id) => {
    if (!user) {
      return;
    }
    const userAction = window.confirm("Are you sure to delete?");
    if (!userAction) {
      return;
    }
    fetch(`${PROD_RES_URL}delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      dispatch({ type: "DELETE_RESERVATION", payload: { _id: id } });
    });
  };

  return (
    <>
      <li key={_id}>
        <img src={`https://source.unsplash.com/random/200x200?sig=${index}`} />
        <div>
          <span style={{ marginRight: "0" }}>
            {name}, Unit : {unit}
          </span>
          <span>
            {user.id === user_id && (
              <>
                <span
                  className="icon material-symbols-outlined"
                  onClick={() => modifyReservation(_id)}
                >
                  edit
                </span>
              </>
            )}
          </span>
          <span>
            {user.id === user_id && (
              <>
                <span
                  className="icon material-symbols-outlined"
                  onClick={() => deleteReservation(_id)}
                >
                  delete
                </span>
              </>
            )}
          </span>
          <h4>
            {new Date(date).toLocaleDateString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </h4>
          <span className="ampm">
            {formatAMPM(timeFrom)} - {formatAMPM(timeTo)}
          </span>
        </div>
      </li>
    </>
  );
};

export default ReservationDetails;
