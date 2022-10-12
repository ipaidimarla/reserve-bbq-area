import { faVestPatches } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { PROD_RES_URL, PROD_USER_URL } from "../utils/URLs";

export const useSignup = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(PROD_USER_URL + "signup", {
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
  return { signup, isLoading, error };
};
