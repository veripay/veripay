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
import {formatMoney, formatTimeHHMM, isPointInGeofence, withRouter} from "./utils.jsx";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {latlong: [], nextEvent: null, athleteId: Cookies.get("athlete-id"), banner: {header: "", body: "", hidden: true}}

    this.databaseConnection = Database.database;

    this.updateLocation = this.updateLocation.bind(this);
    this.updateLogin = this.updateLogin.bind(this);
    this.handleBannerClick = this.handleBannerClick.bind(this);

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
  }

  startBannerResetTimer() {
    setTimeout(this.handleBannerClick, 10000)
  }

  handleBannerClick() {
    this.setState({banner: {...this.state.banner, hidden: true}})
  }

  updateLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({coords}) => {
        this.setState({latlong: [
            coords.latitude,
            coords.longitude
          ]});

        let currentEvent = this.databaseConnection.getCurrentEvent();
        let lastEvent = this.databaseConnection.checkEventJustEnded();

        if (currentEvent !== undefined) {
          let location = this.databaseConnection.getLocationQuick(currentEvent.locationId);
          let isInLoc = isPointInGeofence(location, coords);

          if (isInLoc !== currentEvent.attended) {
            this.databaseConnection.updateIsAttended(currentEvent.id, isInLoc).then(console.log).then(() => this.databaseConnection.updateEvents()).catch(console.error);
            this.setState({banner: {header: "You've arrived!", body: `${currentEvent.name} ends at ${formatTimeHHMM(new Date(currentEvent.end))}`, hidden: false}});
            this.startBannerResetTimer();
          }
        }

        if (lastEvent && lastEvent.attended) {
          this.setState({banner: {header: "Congrats!", body: `You just earned $${formatMoney(lastEvent.payment)} for ${lastEvent.name}`, hidden: false}});
          this.startBannerResetTimer();
        }
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
        <Banner {...this.state.banner} onClick={this.handleBannerClick} />
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

function Banner({header, body, hidden, onClick}) {
  return <div className={"banner " + (hidden ? "hidden" : "")} onClick={onClick}>
    <div className="banner-content">
      <h3>{header}</h3>
      <p>{body}</p>
    </div>
  </div>
}

let WrappedApp = withRouter(App);
export default WrappedApp;