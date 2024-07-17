import { Component } from "react";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import './Director.scss';
import Database from "../Database.jsx";

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
            <div class="header">
              <img src="../../public/logo512.png" />
              <h1>Director Dashboard</h1>
              <button class="signout" onClick={signOut}>Sign Out</button>
            </div>

            <div class="content">
              <div class="section">
                <h2>Events</h2>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  this.database.createEvent(
                    formData.get('name'),
                    formData.get('type'),
                    new Date(formData.get('start')),
                    new Date(formData.get('end')),
                    Number(formData.get('payment')),
                    formData.get('location')
                  );
                  e.target.reset();
                }}>
                  <input name="name" type="text" placeholder="Event Name" required />
                  <input name="type" type="text" placeholder="Type" required />
                  <input name="start" type="datetime-local" required />
                  <input name="end" type="datetime-local" required />
                  <input name="payment" type="number" step="0.01" placeholder="Payment" required />
                  <button type="submit">Create Event</button>
                </form>
              </div>

              <div class="section">
                <h2>Locations</h2>

                <ul>
                  {this.database.locations.map((location) => (
                    <li key={location.id} class="location">
                      <div class="location-info">
                        <p class="location-name">{location.name}</p>
                        <p>{location.lat} {location.long} {location.radius}</p>
                      </div>
                      <div style={{ background: location.color }} class="location-color"></div>
                      <button class="delete" onClick={() => deleteLocation(location.id)}>-</button>
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

              <div class="section">
                <h2>Athletes</h2>

                <ul>
                  {this.database.athletes.map((athlete) => (
                    <li key={athlete.id} class="athlete">
                      <div class="athlete-info">
                        {athlete.name} {athlete.email}
                      </div>
                      <button class="delete" onClick={() => deleteAthlete(athlete.id)}>-</button>
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
