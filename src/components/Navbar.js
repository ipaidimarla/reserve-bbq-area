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
        
          <h2>
            <span className="material-symbols-outlined">outdoor_grill</span>BBQ
            Area Reservations
            <span className="material-symbols-outlined">outdoor_grill</span>
          </h2>
 

        <nav>
          {user && (
            <div style={{ padding: "1%" }}>
              <span>
                Logged in as :<i>{" " + user.email} </i>
              </span>
              <button
                style={{ marginBottom: "1%" }}
                type="button"
                className="btn"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link style={{ padding: "1%" }} to="/login">
                Login
              </Link>
              or
              <Link className="btn" to="/signup">
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
