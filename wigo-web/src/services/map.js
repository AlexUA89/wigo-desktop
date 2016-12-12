// wrapper around Google map API.
import GMaps from 'gmaps';
import backend from './backend';
import config from '../config';

let map = null;
let onMarkerClick = null;
const markersMap = {};
const statuses = [];

function drawStatus(status) {
  const marker = {
    lat: status.latitude,
    lng: status.longitude,
    title: status.name,
    icon: backend.getStatusIcon(status),
    click() {
      map.setCenter(status.latitude, status.longitude);
      if (onMarkerClick) onMarkerClick(status);
    },
  };

  markersMap[status.id] = marker;
  map.addMarker(marker);
}

export default {
  init(el) {
    map = new GMaps({
      el,
      lat: config.latitude,
      lng: config.longitude,
    });
    for (let i = 0; i < statuses.length; i += 1) drawStatus(statuses[i]);
  },
  addStatus(newStatus) {
    statuses.push(newStatus);
    if (map !== null) drawStatus(newStatus);
  },
  clearAllStatuses() { map.removeMarkers(); },
  setClickCallback(callback) { onMarkerClick = callback; },
};
