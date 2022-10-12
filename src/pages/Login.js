import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const { login, error, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      <div className="container">
        <h3>Login</h3>

        <article>
          <form className="form" onSubmit={submitLogin}>
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
              Login
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

export default Login;
