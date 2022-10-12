import {
  BrowserRouter,
  Routes,
  Route,
  Switch,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Singup";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";
function App() {
  const { user } = useAuthContext();
  return (
    <div className="container">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
        <br />
        <footer>
          Developed by <i>Madhan Paidimarla</i>
        </footer>
        <br />
      </BrowserRouter>
    </div>
  );
}

export default App;
