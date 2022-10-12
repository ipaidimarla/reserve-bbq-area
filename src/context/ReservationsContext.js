import { createContext, useReducer } from "react";

export const ReservationsContext = new createContext();
export const reservationsReducer = (state, action) => {
  switch (action.type) {
    case "GET_RESERVATIONS":
      return {
        reservations: action.payload,
      };

    case "ADD_RESERVATION":
      return {
        reservations: [action.payload, ...state.reservations],
      };
    case "DELETE_RESERVATION":
      return {
        reservations: state.reservations.filter(
          (r) => r._id !== action.payload._id
        ),
      };
    case "SET_RESERVATION":
     return {
       reservations: action.payload,
     };
    default:
      return state;
  }
};
export const ReservationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reservationsReducer, {
    reservations: null,
  });

  return (
    <>
      <ReservationsContext.Provider value={{ ...state, dispatch }}>
        {children}
      </ReservationsContext.Provider>
    </>
  );
};
