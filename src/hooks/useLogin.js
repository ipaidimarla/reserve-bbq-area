import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { PROD_RES_URL, PROD_USER_URL } from "../utils/URLs";

export const useLogin = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(PROD_USER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (json.error) {
      setIsLoading(false);
      setError(json.error);
    }
    if (!json.error) {
      setIsLoading(false);
      setError(null);
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update auth context
      dispatch({ type: "LOGIN", payload: json });
    }
  };
  return { login, isLoading, error };
};
