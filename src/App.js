import { AddReservation } from "./AddReservation";
import ShowReservations from "./ShowReservations";

function App() {
  return <div className="container">
    <h2>BBQ Area Reservation</h2>
    <h4>Make reservations for BBQ area @ Villages - Cupertino</h4>
    <br/>
    <br/>
    <AddReservation/>
    <footer>
      <i>Developed by Madhan Paidimarla</i>
    </footer>
    <br/>
  </div>;
}

export default App;
