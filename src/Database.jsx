// import data from './app/data.json';
// import {Schema} from '../../amplify/data/resource';
import { generateClient } from "aws-amplify/data";

export default class Database {
  static database = new Database();

  constructor() {
    this.locations = [];
    this.events = [];
    this.athletes = [];
    this.transactions = [];

    this.loggedInAthlete = null;

    this.client = generateClient();

    this.updatePromise = null;
    this.loaded = false;

    this.lastCurrentEvent = undefined;
  }

  async isNewUpdate() {
    if (this.updatePromise === null) {
      this.updatePromise = await Promise.all([this.updateAthletes(),
      this.updateEvents(),
      this.updateLocations(),
      this.updateTransactions(),]);
      this.loaded = true;
      return true;
    }
    return false;
  }

  logInAthlete(athleteId) {
    this.loggedInAthlete = athleteId;
  }

  logOutAthlete() {
    this.loggedInAthlete = null;
  }

  getModels() {
    return this.client.models;
  }

  async createLocation(name, lat, long, radius, color) {
    return this.client.models.Location.create({
      name,
      lat,
      long,
      radius,
      color
    })
  }

  async deleteLocation(id) {
    return this.client.models.Location.delete({ id });
  }

  async createEvent(name, type, start, end, payment, locationId) {
    return await Promise.all(this.getAthletes().map(({id}) =>
        this.getModels().Event.create({
          name,
          type,
          start,
          end,
          payment,
          locationId,
          athleteId: id,
          attended: false
        })
    ))
  }

  async createAthlete(name, email, password) {
    return await this.client.models.Athlete.create({
      name, email, password
    });
  }

  async deleteAthlete(id) {
    return this.client.models.Athlete.delete({ id });
  }

  async updateLocations() {
    // return data["locations"];
    // return this.client.models.Location.list();
    let { data, errors } = await this.client.models.Location.list();
    this.locations = data;
  }

  async updateEvents() {
    // return data["locations"];
    // return this.client.models.Location.list();
    let { data, errors } = await this.client.models.Event.list();

    this.events = data;
  }

  async updateAthletes() {
    // return data["locations"];
    // return this.client.models.Location.list();
    let { data, errors } = await this.client.models.Athlete.list();
    this.athletes = data;
  }

  async updateTransactions() {
    // return data["locations"];
    // return this.client.models.Location.list();
    let { data, errors } = await this.client.models.Transaction.list();
    this.transactions = data;
  }

  // getLocation(id) {
  //   return this.getLocations().find(p => p.id === id);
  //     return null;
  // }

  getEventsOnDate(date) {

    let dayCopy = new Date(date.getTime());
    dayCopy.setHours(0, 0, 0, 0);

    let eventsOnDay = this.getEvents().filter(({ start }) => {
      let startDate = new Date(start);
      let secondsDiff = startDate - dayCopy;

      return 0 <= secondsDiff && secondsDiff < 24 * 60 * 60 * 1000;
    });

    return eventsOnDay;
  }

  getEvents() {
    if (this.loggedInAthlete !== null) {
      return this.events.filter(({ athleteId }) => athleteId === this.loggedInAthlete)
    }
    return this.events;
  }

  getTransactions() {
    if (this.loggedInAthlete !== null) {
      return this.transactions.filter(({ athleteId }) => athleteId === this.loggedInAthlete)
    }
    return this.transactions;
  }

  getLocations() {
    return this.locations;
  }

  getAthletes() {
    return this.athletes;
  }

  getLoggedInAthlete(callbackToLogout) {
    let athlete = this.athletes.find(({ id }) => this.loggedInAthlete === id);

    if (athlete === undefined) {
      this.logOutAthlete();
      callbackToLogout();
    }

    return athlete;
  }

  getLocationQuick(locationId) {
    return this.locations.find(({ id }) => id === locationId);
  }

  getFilteredTransactions() {
    let userTransactions = [];

    for (let deposit of this.getTransactions()) {
      userTransactions.push({
        memo: "Transfer to bank account",
        date: new Date(deposit.createdAt),
        amount: deposit.amount,
        isWithdrawal: true,
        id: deposit.id
      })
    }

    for (let paidEvent of this.getPaidEvents()) {
      userTransactions.push({
        memo: `From ${paidEvent.type} at ${this.getLocationQuick(paidEvent.locationId).name}`,
        date: new Date(paidEvent.end),
        amount: paidEvent.payment,
        isWithdrawal: false,
        id: paidEvent.id
      })
    }

    return userTransactions.sort((a, b) => b.date - a.date);
  }

  sumBalance() {
    return this.getFilteredTransactions().reduce((prev, next) => prev + (next.amount * (next.isWithdrawal ? -1 : 1)), 0);
  }

  getPaidEvents() {
    let now = new Date();
    return this.getEvents().filter(({ attended, end }) => attended && (now > new Date(end)));
  }

  async depositAmount(amount) {
    if (this.loggedInAthlete === null) {
      throw Error("No athlete logged in to deposit");
    }

    return await this.getModels().Transaction.create({
      athleteId: this.loggedInAthlete,
      amount,
      isBankDeposit: true,
    });
  }

  getCurrentEvent() {
    if (this.loggedInAthlete !== null) {
      let now = new Date();
      let events = this.getEvents();

      return events.find(({start, end}) => new Date(start) < now && now < new Date(end));
    }
    return undefined;
  }

  checkEventJustEnded() {
    if (this.loggedInAthlete !== null) {
      let curEvent = this.getCurrentEvent();
      let lastEvent = this.lastCurrentEvent;

      this.lastCurrentEvent = curEvent;

      if (lastEvent !== undefined && (curEvent === undefined || curEvent.id !== lastEvent.id)) {
        return lastEvent;
      }
      return false;

    }
    return false;
  }

  async updateIsAttended(eventId, attended) {
    return await this.getModels().Event.update({
      id: eventId,
      attended
    })
  }
}
