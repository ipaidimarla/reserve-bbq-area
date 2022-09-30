import axios from "axios";
import React, { useState } from "react";

export const AddReservation = () => {
  const [maxDate, setMaxdate] = useState(new Date());
  const [status, setStatus] = useState("");

  const max =
    maxDate.getFullYear() +
    "-" +
    maxDate.getMonth() +
    1 +
    "-" +
    maxDate.getDay();
  const [reservation, setReservation] = useState({
    name: "",
    unit: "",
    date: "",
    timeFrom: 0,
    timeTo: 0,
  });

  const submitReservation = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://reserve-bbq-area-api.herokuapp.com/makereservation",
        reservation
      )
      .then((res) => {
        setStatus("Succesfully reserved the BBQ area");
      })
      .catch((err) => {
        setStatus("There is an error in making the reservation");
      });
  };
  const setValuesForreservation = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReservation({ ...reservation, [name]: value });
  };

  return (
    <>
      <article>
        <form className="form" onSubmit={submitReservation}>
          <div className="form-control">
            <label htmlFor="name" className="">
              Name :
            </label>
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
            <label htmlFor="unit" className="">
              Unit :
            </label>
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
            <label htmlFor="date" className="">
              Date :
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={reservation.date}
              onChange={setValuesForreservation}
            ></input>
          </div>
          <div className="form-control">
            <label htmlFor="timeFrom" className="">
              Time from :
            </label>

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
            <label htmlFor="timeTo" className="">
              Time to :
            </label>
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
        <div>{status}</div>
      </article>
    </>
  );
};
