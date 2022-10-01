import axios from "axios";
import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

export const AddReservation = () => {
  const [status, setStatus] = useState({ message: "", type: "" });
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
    if (!isTimeValid()) {
      alert("Start time is later than end time.");
      return;
    }
    users.map((user) => {
      if (user.date === reservation.date) {
        const timeWindow = [
          { start: user.timeFrom, end: user.timeTo },
          { start: reservation.timeFrom, end: reservation.timeTo },
        ];
        if (isOverlapping(timeWindow)) {
          alert(
            `Sorry, time window already taken or there is an overlap.${user.name} from unit ${user.unit} has taken this slot. try a different timw window`
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
    axios
      .post(
        "https://reserve-bbq-area-api.herokuapp.com/makereservation",
        reservation
      )
      .then((res) => {
        setUsers(
          [...users, reservation].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
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
        <div
          style={{ backgroundColor: status.type === "error" ? "red" : "teal" }}
        >
          {status.message}
        </div>
      </article>
      <h3>Upcoming Reservations</h3>
      <ul className="users">
        {users.map((user, index) => {
          const { id, name, unit, timeFrom, timeTo } = user;
          let date = new Date(user.date);
          date.setDate(date.getDate() + 1);
          return (
            <li key={id}>
              <img
                src={`https://source.unsplash.com/random/200x200?sig=${index}`}
              />
              <div>
                <span>
                  {name}, Unit : {unit}{" "}
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
              <div></div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
