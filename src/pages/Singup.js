import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const { signup, error, isLoading } = useSignup();

  const submitSignup = async (e) => {
    e.preventDefault();
    await signup(email, password);
    console.log(email, password);
  };

  return (
    <>
      <div className="container">
        <h3>Signup</h3>

        <article>
          <form className="form" onSubmit={submitSignup}>
            <div className="form-control">
              <label htmlFor="email">User Id :</label>
              <input
                type="text"
                id="email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="password">Password :</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <button disabled={isLoading} type="submit" className="btn">
              Signup
            </button>
          </form>

          {error && (
            <div
              style={{
                color: "red",
              }}
            >
              {error}
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default Signup;
