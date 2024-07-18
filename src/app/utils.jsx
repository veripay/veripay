import {Circle, Tooltip} from "react-leaflet";
import {useLocation, useNavigate} from "react-router-dom";

export function isPointInGeofence({lat, long, radius}, coords) {
  const km = radius / 1000;
  const ky = 40000 / 360;
  let kx = Math.cos(Math.PI * lat / 180.0) * ky;
  let dx = Math.abs(long - coords.longitude) * kx;
  let dy = Math.abs(lat - coords.latitude) * ky;

  return Math.sqrt(dx * dx + dy * dy) <= km;

}

export function getGeofence({name, lat, long, radius, id, color}) {
  return (
    <Circle center={[lat, long]} radius={radius} pathOptions={{fillColor: color, fillOpacity: 0.5}} stroke={false} key={name} >
      <Tooltip>
        {name}
      </Tooltip>
    </Circle>)
}

export function formatMoney(value) {
  if (value % 1 !== 0) {
    return value.toFixed(2);
  } else {
    return value.toFixed(0);
  }
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', // abbreviated month name
    day: 'numeric'  // numeric day of the month
  }).format(date);
}

// export function NavigateWrapper() {
//   let navigate = useNavigate();
//
// }

export const withRouter = WrappedComponent => props => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
      <WrappedComponent
          {...props}
          {...{ navigate,location /* other hooks */ }}
      />
  );
};