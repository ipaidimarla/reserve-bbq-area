import { useAuthContext } from "./useAuthContext";
import { useReservationsContext } from "./useReservationsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: reservationsDispatch } = useReservationsContext();

  const logout = () => {
    // remove user from storage

    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    reservationsDispatch({ type: "GET_RESERVATIONS", payload: null });
  };
  return { logout };
};
