import './MapPage.scss';
import MapComponent from "./MapComponent.jsx";
import {Component} from "react";

export default class MapPage extends Component {
    constructor() {
        super();

    }

    render() {
        return (
            <div className="map-container">
                <MapComponent currentPosition={this.props.latlong} places={this.props.database.getLocations()}/>
            </div>
        );
    }
}
