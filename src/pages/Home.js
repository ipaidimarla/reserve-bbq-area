import React, { useEffect } from "react";
import axios from "axios";
import ReservationDetails from "../components/ReservationDetails";
import { useReservationsContext } from "../hooks/useReservationsContext";
import ReservationForm from "../components/ReservationForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { PROD_RES_URL, PROD_USER_URL } from "../utils/URLs";


const Home = () => {
  //const [reservations, setReservations] = useState([]);
  const { reservations, dispatch } = useReservationsContext();
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch(PROD_RES_URL + "getreservations", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }).then(async (response) => {
        const data = await response.json();
        const futureReservations = await data.filter((f) =>
          filterPastReservations(f)
        );
        dispatch({ type: "GET_RESERVATIONS", payload: futureReservations });
      });
    };
    if (user) {
      fetchReservations();
    }
  }, [dispatch, user]);
  const filterPastReservations = (f) => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const date = new Date(f.date);
    if (today.getTime() <= date.getTime()) {
      return true;
    } else {
      axios
        .delete(`${PROD_RES_URL}delete/${f._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("deleted", f);
        });
    }
  };

  return (
    <>
      <ReservationForm />
      <h3>Upcoming Reservations</h3>
      <ul className="users">
        {reservations &&
          reservations.map((reservation, index) => {
            return (
              <ReservationDetails reservation={reservation} index={index} />
            );
          })}
      </ul>
    </>
  );
};

export default Home;
