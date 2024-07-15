// import data from './app/data.json';
// import {Schema} from '../../amplify/data/resource';
import {generateClient} from "aws-amplify/data";

export default class Database {
    static database = new Database();

    constructor() {

        this.locations = [];
        this.events = [];
        this.athletes = [];
        this.transactions = [];

        this.client = generateClient();

        this.updatePromise = null;

    }

    async isNewUpdate() {
        if (this.updatePromise === null) {
            this.updatePromise = await Promise.all([this.updateAthletes(),
                this.updateEvents(),
                this.updateLocations(),
                this.updateTransactions(),]);
            return true;
        }
        return false;

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

    async updateLocations() {
        // return data["locations"];
        // return this.client.models.Location.list();
        let {data, errors} = await this.client.models.Location.list();
        this.locations = data;
    }

    async updateEvents() {
        // return data["locations"];
        // return this.client.models.Location.list();
        let {data, errors} = await this.client.models.Event.list();

        this.events = data;
    }

    async updateAthletes() {
        // return data["locations"];
        // return this.client.models.Location.list();
        let {data, errors} = await this.client.models.Athlete.list();
        this.athletes = data;
    }

    async updateTransactions() {
        // return data["locations"];
        // return this.client.models.Location.list();
        let {data, errors} = await this.client.models.Transaction.list();
        this.transactions = data;
    }

    // getLocation(id) {
    //   return this.getLocations().find(p => p.id === id);
    //     return null;
    // }

    getNextEvent(datetime) {
        //     let nextEvents = this.getEvents().filter(({startTime}) => new Date(startTime * 1000) >= datetime)
        //
        //     return nextEvents.length > 0 ? nextEvents[0] : null;
        return null;
    }

    getEventsOnDate(date) {

        let dayCopy = new Date(date.getTime());
        dayCopy.setHours(0, 0, 0, 0);

        let eventsOnDay = this.getEvents().filter(({start}) => {
            let startDate = new Date(start);
            let secondsDiff = startDate - dayCopy;

            return 0 <= secondsDiff && secondsDiff < 24 * 60 * 60 * 1000;
        });

        return eventsOnDay;
    }

    getEvents() {
        // return data["events"];
        return this.events;
    }

    getLocations() {
        return this.locations;
    }

    getAthletes() {
        return this.athletes;
    }

    getAthlete(athleteId) {
        return this.athletes.find(({id}) => athleteId === id);
    }

    getTransactions() {
        return this.transactions;
    }

    getLocationQuick(locationId) {
        return this.locations.find(({id}) => id === locationId);
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

    getPaidEvents() {
        let now = new Date();
        return this.getEvents().filter(({attended, end}) => attended && (now > new Date(end)));
    }
}