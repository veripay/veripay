import {Component, useEffect, useState} from "react";
// import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import './Director.css';
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
        {({ signOut, user }) => (
          <main>
            <h1>Events</h1>

            <ul>
              // TODO this must somehow find unique events from all athletes?
              {this.database.events.map((event) => (
                <li key={event.id} class="event">
                  <div class="event-info">

                  </div>
                </li>
              ))}
            </ul>

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
              <input name="type" type="text" placeholder="Event Type" required />
              <input name="start" type="datetime-local" required />
              <input name="end" type="datetime-local" required />
              <input name="payment" type="number" step="0.01" placeholder="Payment" required />
              <input name="lat" type="number" step="any" placeholder="Latitude" required />
              <input name="long" type="number" step="any" placeholder="Longitude" required />
              <button type="submit">Create Event</button>
            </form>

            <h1>Locations</h1>

            <ul>
              {this.database.locations.map((location) => (
                <li key={location.id} class="location">
                  <div class="location-info">
                    {location.name} {location.lat} {location.long} {location.radius}
                  </div>
                  <div style={{ background: location.color }} class="location-color"></div>
                  <button onClick={() => deleteLocation(location.id)}>-</button>
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

            <h1>Athletes</h1>

            <ul>
              {this.database.athletes.map((athlete) => (
                <li key={athlete.id} class="athlete">
                  <div class="athlete-info">
                    {athlete.name} {athlete.email}
                  </div>
                  <button onClick={() => deleteAthlete(athlete.id)}>-</button>
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

            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    );
  }

  componentDidMount() {
    this.databaseConnection.isNewUpdate().then(isNew => isNew ? this.setState({}) : null)
  }
}

let WrappedDirector = withRouter(Director);
export default WrappedDirector;
