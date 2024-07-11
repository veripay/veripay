import data from './app/data.json';
// import {Schema} from '../../amplify/data/resource';
import { generateClient } from "aws-amplify/data";

export default class Database {
  static database = new Database();

   constructor() {

    this.client = generateClient();
    //
    console.log(this.client.models);

  }

  getModels() {
     return this.client.models;
  }

  async createLocation(name, radius, lat, long, color) {
     return this.client.models.Location.create({
       name,
       radius,
       lat,
       long,
       color
         }
     )
  }

  getLocations() {
    return data["locations"];
  }

  getLocation(id) {
    return this.getLocations().find(p => p.id === id);
  }

  getNextEvent(datetime) {
    let nextEvents = this.getEvents().filter(({startTime}) => new Date(startTime * 1000) >= datetime)

    return nextEvents.length > 0 ? nextEvents[0] : null;
  }

  getEventsOnDate(date) {
    let dayCopy = new Date(date.getTime());
    dayCopy.setHours(0, 0, 0, 0);

    let eventsOnDay = this.getEvents().filter(({startTime}) => {
      let startDate = new Date(startTime * 1000);
      let secondsDiff = startDate - dayCopy;

      return 0 <= secondsDiff && secondsDiff < 24 * 60 * 60 * 1000;
    });

    return eventsOnDay;
  }

  getEvents() {
    return data["events"];
  }

  getTransactions(reverse=false) {
    if (reverse) {
      return data["transactions"].reverse();
    } else {
      return data["transactions"];
    }
  }
}