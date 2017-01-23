// wrapper around Google map API.
/* global $ */
import GMaps from 'gmaps';
import backend from './backend';
import config from '../config';

let map = null;
let onMarkerClick = null;
let addition = false;
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
  init(el, clickCallback) {
    map = new GMaps({
      el,
      lat: config.latitude,
      lng: config.longitude,
    });
    for (let i = 0; i < statuses.length; i += 1) drawStatus(statuses[i]);
    GMaps.on('click', map.map, (event) => {
      if (!addition) return;
      clickCallback(event.latLng.lat(), event.latLng.lng());
      this.disableAddition();
    });
  },
  addStatus(newStatus) {
    statuses.push(newStatus);
    if (map !== null) drawStatus(newStatus);
  },
  setCenter(status) { map.setCenter(status.latitude, status.longitude); },
  clearAllStatuses() { map.removeMarkers(); },
  setClickCallback(callback) { onMarkerClick = callback; },
  enableAddition() {
    addition = true;
    map.setOptions({ draggableCursor: 'crosshair' });
    map.setOptions({ clickableIcons: false });
  },
  disableAddition() {
    if (!addition) return;
    map.setOptions({ draggableCursor: undefined });
    map.setOptions({ clickableIcons: true });
    addition = false;
  },
};
