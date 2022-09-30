import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import axios from "axios";

const url = "https://reserve-bbq-area-api.herokuapp.com/getreservations";
const ShowReservations = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    await axios
      .get(url)
      .then(async (res) => {
        const data = res.data;
        const futureReservations = await data.filter((f) =>
          filterPastReservations(f)
        );
        setUsers(futureReservations);
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
  return (
    <>
      <h3>Reservations</h3>
      <ul className="users">
        {users.map((user) => {
          const { id, name, date, unit, timeFrom, timeTo } = user;
          return (
            <li key={id}>
              <img src={faker.internet.avatar()} />
              <div>
                <h4>
                  {name}, Unit : {unit}{" "}
                </h4>
                <h4>{date}</h4>
                {timeFrom} to {timeTo}
              </div>
              <div></div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ShowReservations;
