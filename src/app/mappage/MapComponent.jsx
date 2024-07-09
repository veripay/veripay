import React from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapMarker from '../../assets/map-marker.svg'
import {getGeofence} from "../utils.jsx";

class MapComponent extends React.Component {

    render() {
        if (this.props.currentPosition.length > 0) {
            return (
                <MapContainer center={this.props.currentPosition} zoom={17} style={{height: "100%", width: "100%"}}>
                    <TileLayer
                        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        url="https://tile.jawg.io/ef1284c5-fb8f-48f1-aad1-48e9911ba638/{z}/{x}/{y}{r}.png?access-token=pYcIHzBTzlnSCskylxSPTdb8uXqtbgvnjBNcSfdC127aHVGzgjKeCaWCCiNDPezw"
                        attribution={'<a href=\\"https://www.jawg.io?utm_medium=map&utm_source=attribution\\" target=\\"_blank\\">&copy; Jawg</a> - <a href=\\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\\" target=\\"_blank\\">&copy; OpenStreetMap</a>&nbsp;contributors'}
                    />
                    <Marker position={this.props.currentPosition} icon={posMarker} riseOnHover={true} riseOffset={20}/>
                    {this.props.places.map(p => getGeofence(p, 'navy'))}
                </MapContainer>
            );
        } else {
            return <p>Loading Location...</p>;
        }
    }
}

const posMarker = new L.Icon({
    iconUrl: mapMarker,
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // Point from which the popup should open relative to the iconAnchor
});

export default MapComponent;