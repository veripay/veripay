import './App.scss';
import {Component} from "react";
import {Route, Routes} from "react-router";
import MapPage from "./mappage/MapPage.jsx";
import {Link, NavLink} from "react-router-dom";
import Database from "../Database.jsx";
import SchedulePage from "./schedulepage/SchedulePage.jsx";
import WalletPage from "./walletpage/WalletPage.jsx";

// import { Amplify } from 'aws-amplify';
// import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: 'YOUR_USER_POOL_ID',
//       userPoolClientId: 'YOUR_CLIENT_ID',
//       region: 'YOUR_REGION',
//     },
//   },
// });
//
// cognitoUserPoolsTokenProvider.setKeyValueStorage(window.localStorage);


export default class App extends Component {
  constructor() {
    super();

    this.state = {latlong: [], nextEvent: null}

    this.databaseConnection = Database.database;

    this.updateLocation = this.updateLocation.bind(this);

    this.updatePeriodSeconds = 5;
    setInterval(this.updateLocation, this.updatePeriodSeconds * 1000);


    window.appComponent = this;
  }

  componentDidMount() {
    this.updateLocation()
    this.databaseConnection.isNewUpdate().then(isNew => isNew ? this.setState({}) : null)

    // let nextEvent = this.databaseConnection.getNextEvent(new Date());
    //
    // if (nextEvent !== null) {
    //   nextEvent.callback = setTimeout(() => this.startCheckEvent(nextEvent), 1000 /*(nextEvent.startTime * 1000) - (new Date())*/);
    //   // nextEvent.totalChecks = 0;
    //   // nextEvent.passedChecks = 0;
    //
    //   this.setState({nextEvent});
    // }
  }

  startCheckEvent(event) {
    console.log("checking", event, new Date());
  }



  updateLocation() {
    console.log(this.databaseConnection.getNextEvent(new Date()))
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.setState({latlong: [
            pos.coords.latitude,
            pos.coords.longitude
            // 38.829008416216084, -77.07319429791512
          ]
        });
      }, (err) => {
        console.error("Error obtaining geolocation", err);
      });

    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }

  render() {
    return (
      <>
        <Routes>
          <Route path="/" element={<SchedulePage database={this.databaseConnection} />} />
          <Route path="/map" element={<MapPage latlong={this.state.latlong} database={this.databaseConnection} />} />
          <Route path="/wallet" element={<WalletPage database={this.databaseConnection} />} />
        </Routes>
        <div className="bottom-nav-bar material-symbols-rounded">
          <NavLink to="/app/" end>Calendar_Today</NavLink>
          <NavLink to="/app/map">My_Location</NavLink>
          <NavLink to="/app/wallet">Account_Balance</NavLink>
        </div>
      </>
    )
  }
}