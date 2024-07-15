import './App.scss';
import {Component} from "react";
import {Route, Routes} from "react-router";
import MapPage from "./mappage/MapPage.jsx";
import {Link, NavLink, Navigate} from "react-router-dom";
import Database from "../Database.jsx";
import SchedulePage from "./schedulepage/SchedulePage.jsx";
import WalletPage from "./walletpage/WalletPage.jsx";
import Cookies from "js-cookie";
import AthleteLoginPage from "./athleteloginpage/AthleteLoginPage.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {latlong: [], nextEvent: null, athleteId: Cookies.get("athlete-id")}

    console.log(typeof this.state.athleteId, !!this.state.athleteId, this.state.athleteId === undefined, undefined === undefined)
    // console.log(!!this.state.athleteId, this.state.athleteId === undefined)
    //
    // if (this.state.athleteId === undefined && this.props.location.pathName !== "/app/login") {
    //   // console.log("lol")
    //   // this.props.history.push("/app/login")
    // }

    this.databaseConnection = Database.database;

    this.updateLocation = this.updateLocation.bind(this);
    this.updateLogin = this.updateLogin.bind(this);

    this.updatePeriodSeconds = 5;
    setInterval(this.updateLocation, this.updatePeriodSeconds * 1000);


    window.appComponent = this;
  }

  updateLogin() {
    this.setState({athleteId: Cookies.get("athlete-id")})
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
        {this.state.athleteId ? "" : <Navigate to="/app/login"></Navigate>}
        <Routes>
          <Route path="/" element={<SchedulePage database={this.databaseConnection} athleteId={this.state.athleteId}/>} />
          <Route path="/map" element={<MapPage latlong={this.state.latlong} database={this.databaseConnection} athleteId={this.state.athleteId} />} />
          <Route path="/wallet" element={<WalletPage database={this.databaseConnection} athleteId={this.state.athleteId} updateLogin={this.updateLogin} />} />
          <Route path="/login" element={<AthleteLoginPage database={this.databaseConnection}/>} />
        </Routes>
        <div className="bottom-nav-bar material-symbols-rounded" style={{display: this.state.athleteId ? "" : "none"}}>
          <NavLink to="/app/" end>Calendar_Today</NavLink>
          <NavLink to="/app/map">My_Location</NavLink>
          <NavLink to="/app/wallet">Account_Balance</NavLink>
        </div>
      </>
    )
  }
}