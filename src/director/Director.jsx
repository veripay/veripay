import { Component } from "react";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import './Director.scss';
import Database from "../Database.jsx";
import {Link} from "react-router-dom";

class Director extends Component {
  constructor(props) {
    super(props);
    this.database = Database.database;
    window.appComponent = this;
  }

  render() {
    return (
      <Authenticator>
        {({ signOut }) => (
          <main>
            <div className="header">
              <Link to={"/"}>
                <img src="/logo512.png" />
              </Link>
              <h1>Director Dashboard</h1>
              <button className="signout" onClick={signOut}>Sign Out</button>
            </div>

            <div className="content">
              <div className="section">
                <h2>Events 🏅</h2>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  console.log(
                  formData.get("date"),
                  formData.get("start"))
                  this.database.createEvent(
                    formData.get('name'),
                    formData.get('type'),
                    new Date(`${formData.get("date")}T${formData.get('start')}`).toISOString(),
                    new Date(`${formData.get("date")}T${formData.get('end')}`).toISOString(),
                    Number(formData.get('payment')),
                    formData.get('location')
                  ).then(console.log).catch(console.error);
                  e.target.reset();
                }}>
                  <input name="name" type="text" placeholder="Event Name" required />
                  <select name="type">
                      <option value="Practice">Practice</option>
                      <option value="Class">Class</option>
                      <option value="Tutoring">Tutoring</option>
                  </select>
                  <input name="date" type="date" required />
                  <input name="start" type="time" required />
                  <input name="end" type="time" required />
                  <input name="payment" type="number" step="0.01" placeholder="Payment" required />
                  <select name="location">
                    {this.database.locations.map((location) => (
                      <option value={location.id}>{location.name}</option>
                    ))}
                  </select>
                  <button type="submit">Create Event</button>
                </form>
              </div>

              <div className="section">
                <h2>Locations 📍</h2>

                <ul>
                  {this.database.locations.map((location) => (
                    <li key={location.id} className="location">
                      <div className="location-info">
                        <p className="location-name">{location.name}</p>
                        <p>{location.lat} {location.long} {location.radius}</p>
                      </div>
                      <div style={{ background: location.color }} className="location-color"></div>
                      <button className="delete" onClick={() => this.database.deleteLocation(location.id)}>-</button>
                    </li>
                  ))}
                </ul>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  this.database.createLocation(
                    formData.get('name'),
                    Number(formData.get('lat')),
                    Number(formData.get('long')),
                    Number(formData.get('radius')),
                    formData.get('color'),
                  );
                  e.target.reset();
                }}>
                  <input name="name" type="text" placeholder="Location Name" required />
                  <input name="lat" type="number" step="any" placeholder="Latitude" required />
                  <input name="long" type="number" step="any" placeholder="Longitude" required />
                  <input name="radius" type="number" step="any" placeholder="Radius" required />
                  <input name="color" type="text" placeholder="Color" required />
                  <button type="submit">Create Location</button>
                </form>
              </div>

              <div className="section">
                <h2>Athletes 🏃</h2>

                <ul>
                  {this.database.athletes.map((athlete) => (
                    <li key={athlete.id} className="athlete">
                      <div className="athlete-info">
                        <b>{athlete.name}</b> {athlete.email}
                      </div>
                      <button className="delete" onClick={() => this.database.deleteAthlete(athlete.id)}>-</button>
                    </li>
                  ))}
                </ul>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  this.database.createAthlete(
                    formData.get('name'),
                    formData.get('email'),
                    formData.get('password'),
                  );
                  e.target.reset();
                }}>
                  <input name="name" type="text" placeholder="Athlete Name" required />
                  <input name="email" type="email" placeholder="Email" required />
                  <input name="password" type="password" placeholder="Password" required />
                  <button type="submit">Create Athlete</button>
                </form>
              </div>
            </div>
          </main>
        )}
      </Authenticator>
    );
  }

  componentDidMount() {
    this.database.isNewUpdate().then(isNew => isNew ? this.setState({}) : null)
  }
}

export default Director;
