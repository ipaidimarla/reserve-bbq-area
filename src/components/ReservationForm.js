import React, { useState } from "react";
import { useReservationsContext } from "../hooks/useReservationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { PROD_RES_URL, PROD_USER_URL } from "../utils/URLs";

const ReservationForm = () => {
  const { reservations, dispatch } = useReservationsContext();
  const { reservationFromDetail, dispatch: reservationDispatch } =
    useReservationsContext();
  const [error, setError] = useState();
  const { user } = useAuthContext();
  const max = new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [reservation, setReservation] = useState({
    name: "",
    unit: "",
    date: "",
    timeFrom: 0,
    timeTo: 0,
  });
  const showReservationStatus = (status) => {
    setStatus({
      message: status.message,
      type: status.type,
    });
    setTimeout(() => {
      setStatus({});
    }, 5000);
  };
  const setValuesForreservation = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReservation({ ...reservation, [name]: value });
  };
  const overlapping = (a, b) => {
    const getMinutes = (s) => {
      const p = s.split(":").map(Number);
      return p[0] * 60 + p[1];
    };
    return (
      getMinutes(a.end) > getMinutes(b.start) &&
      getMinutes(b.end) > getMinutes(a.start)
    );
  };
  const isOverlapping = (arr) => {
    let i, j;
    for (i = 0; i < arr.length - 1; i++) {
      for (j = i + 1; j < arr.length; j++) {
        if (overlapping(arr[i], arr[j])) {
          return true;
        }
      }
    }
    return false;
  };

  const isTimeValid = () => {
    const getMinutes = (s) => {
      const p = s.split(":").map(Number);
      return p[0] * 60 + p[1];
    };
    return getMinutes(reservation.timeFrom) < getMinutes(reservation.timeTo);
  };
  const submitReservation = (e) => {
    let isTimeOverlapse = false;
    e.preventDefault();
    if (!user) {
      setError("You must login");
      return;
    }
    if (!isTimeValid()) {
      alert("Start time is later than end time.");
      return;
    }
    reservations.map((user) => {
      if (user.date === reservation.date) {
        const timeWindow = [
          { start: user.timeFrom, end: user.timeTo },
          { start: reservation.timeFrom, end: reservation.timeTo },
        ];
        if (isOverlapping(timeWindow)) {
          alert(
            `Sorry, this time window is already taken or there is an overlap. ${user.name} from unit ${user.unit} has taken this slot. Try a different time window or a different date`
          );
          isTimeOverlapse = true;
          return;
        }
      }
    });
    if (isTimeOverlapse) {
      showReservationStatus({
        message: "There is an error in making the reservation",
        type: "error",
      });
      return;
    }
    fetch(PROD_RES_URL + "makereservation", {
      method: "POST",
      body: JSON.stringify(reservation),
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        dispatch({ type: "ADD_RESERVATION", payload: reservation });
        showReservationStatus({
          message: "Succesfully reserved the BBQ area",
          type: "success",
        });
        setReservation({
          name: "",
          unit: "",
          date: "",
          timeFrom: "",
          timeTo: "",
        });
      })
      .catch((err) => {
        showReservationStatus({
          message: "There is an error in making the reservation",
          type: "error",
        });
      });
  };
  const [status, setStatus] = useState({ message: "", type: "" });
  return (
    <>
      <article>
        <form className="form" onSubmit={submitReservation}>
          <div className="form-control">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              required
              name="name"
              value={reservation.name}
              onChange={setValuesForreservation}
            ></input>
          </div>
          <div className="form-control">
            <label htmlFor="unit">Unit :</label>
            <input
              type="text"
              id="unit"
              required
              value={reservation.unit}
              name="unit"
              onChange={setValuesForreservation}
            ></input>
          </div>

          <div className="form-control">
            <label htmlFor="date">Date :</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              max={max}
              value={reservation.date}
              onChange={setValuesForreservation}
            ></input>
          </div>
          <div className="form-control">
            <label htmlFor="timeFrom">Time from :</label>

            <input
              type="time"
              id="timeFrom"
              required
              name="timeFrom"
              value={reservation.timeFrom}
              onChange={setValuesForreservation}
            ></input>
          </div>
          <div className="form-control">
            <label htmlFor="timeTo">Time to :</label>
            <input
              type="time"
              id="timeTo"
              required
              name="timeTo"
              value={reservation.timeTo}
              onChange={setValuesForreservation}
            ></input>
          </div>
          <button type="submit" className="btn">
            Make reservation
          </button>
         
        </form>
        <div style={{ color: "red" }}>{error}</div>
      </article>
    </>
  );
};

export default ReservationForm;
