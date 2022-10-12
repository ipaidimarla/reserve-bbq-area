import React, { useState } from "react";

const Admin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const submitLogin = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="container">
        <h2>Login</h2>

        <article>
          <form className="form" onSubmit={submitLogin}>
            <div className="form-control">
              <label htmlFor="userId">User Id :</label>
              <input
                type="text"
                id="userId"
                required
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="unit">Password :</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <button type="submit" className="btn">
              Login
            </button>
          </form>
          <div
            style={{
              backgroundColor: status.type === "error" ? "red" : "teal",
            }}
          >
            {status.message}
          </div>
        </article>
      </div>
    </>
  );
};

export default Admin;
