import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const logoutHandler = (e) => {
    e.preventDefault();
    logout();
  };
  return (
    <>
      <header>
        <h4>Villages @ Cupertino</h4>
        <Link to="/">
          <h2>
            <span className="material-symbols-outlined">outdoor_grill</span>BBQ Area
            Reservations
            <span className="material-symbols-outlined">outdoor_grill</span>
          </h2>
        </Link>

        <nav>
          {user && (
            <div style={{ padding: "1%" }}>
              <span>
                <i>You logged in as : </i>
                {user.email}
              </span>
              <button type="button" className="btn" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link  style={{ padding: "1%" }} to="/login">
                Login
              </Link>
              or
              <Link className="btn"  to="/signup">
                Signup
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
