import axios from "axios";
import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

export const AddReservation = () => {
  const [maxDate, setMaxdate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    await axios
      .get("https://reserve-bbq-area-api.herokuapp.com/getreservations")
      .then(async (res) => {
        const data = res.data;
        const futureReservations = await data.filter((f) =>
          filterPastReservations(f)
        );
        setUsers(
          futureReservations.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const filterPastReservations = (f) => {
    const today = new Date();
    const date = new Date(f.date);
    if (today.getTime() <= date.getTime()) {
      return true;
    } else {
      axios
        .delete(`https://reserve-bbq-area-api.herokuapp.com/delete/${f._id}`)
        .then((res) => {
          console.log("deleted", f);
        });
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

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
        setUsers([...users, reservation]);
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
        <div>{status}</div>
      </article>
      <h3>Upcoming Reservations</h3>
      <ul className="users">
        {users.map((user, index) => {
          const { id, name, date, unit, timeFrom, timeTo } = user;
          return (
            <li key={id}>
              <img src={`https://source.unsplash.com/random/200x200?sig=${index}`}/>
              <div>
                <h4>
                  {name}, Unit : {unit}{" "}
                </h4>
                <h4>{date}</h4>
                <span>
                  {timeFrom} to {timeTo}
                </span>
              </div>
              <div></div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
