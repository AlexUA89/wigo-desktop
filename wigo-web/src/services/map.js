// wrapper around Google map API.
import GMaps from 'gmaps';
import config from '../config';

const icon = require('../assets/event.png');

let map = null;
const statuses = [];

function drawStatus(status) {
  const marker = {
    lat: status.latitude,
    lng: status.longitude,
    title: status.name,
    icon,
    infoWindow: {
      content: 'Some text',
    },
  };

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
};
