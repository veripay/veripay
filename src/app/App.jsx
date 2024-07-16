import './App.scss';
import {Component} from "react";
import {Route, Routes} from "react-router";
import MapPage from "./mappage/MapPage.jsx";
import {NavLink} from "react-router-dom";
import Database from "../Database.jsx";
import SchedulePage from "./schedulepage/SchedulePage.jsx";
import WalletPage from "./walletpage/WalletPage.jsx";
import Cookies from "js-cookie";
import AthleteLoginPage from "./athleteloginpage/AthleteLoginPage.jsx";
import {withRouter} from "./utils.jsx";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {latlong: [], nextEvent: null, athleteId: Cookies.get("athlete-id")}

    this.databaseConnection = Database.database;

    this.updateLocation = this.updateLocation.bind(this);
    this.updateLogin = this.updateLogin.bind(this);

    this.updatePeriodSeconds = 5;
    setInterval(this.updateLocation, this.updatePeriodSeconds * 1000);


    window.appComponent = this;
  }

  updateLogin() {
    this.setState({athleteId: Cookies.get("athlete-id")});
    this.props.navigate("/app/login/");
  }

  checkLoginState() {
    if (this.state.athleteId !== undefined) {
      this.databaseConnection.logInAthlete(this.state.athleteId);
    } else {
      this.databaseConnection.logOutAthlete();
    }

    if (this.state.athleteId === undefined && this.props.location.pathname !== "/app/login/") {
      this.props.navigate("/app/login/");
    } else if (this.state.athleteId !== undefined && this.props.location.pathname === "/app/login/") {
      this.props.navigate("/app/");
    }
  }

  componentDidUpdate() {
    this.checkLoginState();
  }

  componentDidMount() {
    this.checkLoginState();

    this.updateLocation();
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
        <Routes>
          <Route path="/" element={<SchedulePage database={this.databaseConnection} athleteId={this.state.athleteId}/>} />
          <Route path="/map/" element={<MapPage latlong={this.state.latlong} database={this.databaseConnection} athleteId={this.state.athleteId} />} />
          <Route path="/wallet/" element={<WalletPage database={this.databaseConnection} athleteId={this.state.athleteId} updateLogin={this.updateLogin} />} />
          <Route path="/login/" element={<AthleteLoginPage database={this.databaseConnection} updateLogin={this.updateLogin}/>}  />
        </Routes>
        <div className="bottom-nav-bar material-symbols-rounded" style={{display: this.state.athleteId ? "" : "none"}} >
          <NavLink to="/app/" end>Calendar_Today</NavLink>
          <NavLink to="/app/map/">My_Location</NavLink>
          <NavLink to="/app/wallet/">Account_Balance</NavLink>
        </div>
      </>
    )
  }
}

let WrappedApp = withRouter(App);
export default WrappedApp;