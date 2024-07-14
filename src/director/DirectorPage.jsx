import {Component} from "react";
import Database from "../Database.jsx";

export default class DirectorPage extends Component {
    constructor() {
        super();

        this.databaseConnection = Database.database;
        console.log(this.databaseConnection.getModels());
        // this.databaseConnection.createLocation("Football Field", 40, 38.82869054973737, -77.07063098421109, "#FF0000").then(console.log).then(console.error)
    }

    render() {
        return <div>
            <h2>Add Location</h2>
        </div>
    }
}