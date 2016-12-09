// wrapper around Google map API.
import GMaps from 'gmaps';
import config from '../config';

/* eslint global-require: "off" */
const icons = {
  chat: require('../assets/categories/chat.png'),
  dinning_event: require('../assets/categories/dinning_event.png'),
  lecture: require('../assets/categories/lecture.png'),
  music_event: require('../assets/categories/music_event.png'),
  meetup: require('../assets/categories/meetup.png'),
  family_event: require('../assets/categories/family_event.png'),
  conference_event: require('../assets/categories/conference_event.png'),
  theater_event: require('../assets/categories/theater_event.png'),
  art_event: require('../assets/categories/art_event.png'),
  sports_event: require('../assets/categories/sports_event.png'),
  nightlife: require('../assets/categories/nightlife.png'),
  dance_event: require('../assets/categories/dance_event.png'),
  book_event: require('../assets/categories/book_event.png'),
  movie_event: require('../assets/categories/movie_event.png'),
  food_tasting: require('../assets/categories/food_tasting.png'),
  shopping: require('../assets/categories/shopping.png'),
  religious_event: require('../assets/categories/religious_event.png'),
  comedy_event: require('../assets/categories/comedy_event.png'),
  it: require('../assets/categories/it.png'),
  workshop: require('../assets/categories/workshop.png'),
  fitness: require('../assets/categories/fitness.png'),
  festival_event: require('../assets/categories/festival_event.png'),
  volunteering: require('../assets/categories/volunteering.png'),
  other: require('../assets/categories/other.png'),
};

console.log(icons);

let map = null;
let onMarkerClick = null;
const markersMap = {};
const statuses = [];

function drawStatus(status) {
  const icon = icons[status.category.toLowerCase()] || icons.other;
  const marker = {
    lat: status.latitude,
    lng: status.longitude,
    title: status.name,
    icon,
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
