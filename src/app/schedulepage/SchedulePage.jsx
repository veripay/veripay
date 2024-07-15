import {Component} from "react";
import "./SchedulePage.scss"
import {formatMoney} from "../utils.jsx";

const hourBlockHeight = 63;


export default class SchedulePage extends Component {
  constructor() {
    super();

    this.state = {currentDay: new Date()};

    this.handleDecrementDay = this.handleDecrementDay.bind(this);
    this.handleIncrementDay = this.handleIncrementDay.bind(this);
  }

  handleIncrementDay() {
    let newDate = this.state.currentDay;
    newDate.setDate(newDate.getDate() + 1);

    this.setState({currentDay: newDate});
  }

  handleDecrementDay() {
    let newDate = this.state.currentDay;
    newDate.setDate(newDate.getDate() - 1);

    this.setState({currentDay: newDate});
  }

  render() {
    let hours = this.state.currentDay.getHours() + this.state.currentDay.getMinutes() / 60 + this.state.currentDay.getSeconds() / 3600;
    return (
      <div className="schedule-container">
        <div className="date-header">
          <button className={"material-symbols-rounded"} onClick={this.handleDecrementDay}>arrow_back_ios</button>
          <FormatHeaderDate date={this.state.currentDay}/>
          <button className={"material-symbols-rounded"} onClick={this.handleIncrementDay}>arrow_forward_ios</button>
        </div>
        <div className="background-div">
          <div className="current-time" style={{top: (hourBlockHeight * (hours + 0.5)) + "px"}}></div>
          {new Array(25).fill(0).map((v, i) => <TimeDivider hourInDay={i} key={i}/>)}
          {this.props.database.getEventsOnDate(this.state.currentDay).map(ev => <Event {...ev} />)}
        </div>
      </div>
    )

  }
}

function FormatHeaderDate({date}) {
  let formatterDay = new Intl.DateTimeFormat('en-US', {weekday: 'long'});
  let formatterMonthDay = new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric'});

  return <div>
    <h1>{formatterDay.format(date)}</h1>
    <h2>{formatterMonthDay.format(date)}</h2>
  </div>;
}

function TimeDivider({hourInDay}) {
  return (
    <div className="hour-block">
      <p>{idxToTime(hourInDay)}</p>
    </div>
  )
}

function Event({name, start, end, payment, locationId, attended}) {
  let startDate = new Date(start);
    let endDate = new Date(end);
    let hours = (endDate - startDate) / 3600 / 1000;
    let startHours = startDate.getHours() + startDate.getMinutes() / 60 + startDate.getSeconds() / 3600;
  console.log(startHours)
  return (
    <div className={"event-container " + (attended ? "attended" : "")}
         style={{height: (hours * hourBlockHeight) + "px", top: (hourBlockHeight * (startHours + 0.5)) + "px"}}>
      <p><b>{name}</b></p>
      <p>{formatTime(startDate)} - {formatTime(new Date(end))}</p>
      <p className="event-money"><b>{`+$${formatMoney(payment)}`}</b></p>
    </div>
  )
}

function formatTime(time) {
  return new Intl.DateTimeFormat('default',
    {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    }).format(time);
}

function idxToTime(idx) {
  return new Intl.DateTimeFormat('default',
    {
      hour12: true,
      hour: 'numeric',
    }).format(new Date(0, 0, 0, idx));
}
