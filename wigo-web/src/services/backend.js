// wrapper around requests to backend
import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../config';

// configuration
Vue.use(VueResource);
Vue.http.options.root = config.api_root;
Vue.http.headers.common['Access-Control-Allow-Origin'] = config.api_cors;

function updateQueryStringParameter(uri, key, value) {
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) return uri.replace(re, `$1${key}=${value}$2`);
  return `${uri}${separator}${key}=${value}`;
}

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

const datetimeFormat = 'YYYY-MM-DDTHH:mm:ss[Z]';
const statusListURL = 'status';
const statusListQueryParams = {
  startDate: config.filtersDefaults.startDate.format(datetimeFormat),
  endDate: config.filtersDefaults.endDate.format(datetimeFormat),
  search: null,
  categories: null,
};

export default {
  getStatuses() {
    let url = statusListURL;
    function update(param, value) {
      if (value) url = updateQueryStringParameter(url, param, value);
    }
    Object.entries(statusListQueryParams).map(entry => update(...entry));
    return Vue.http.get(url);
  },
  search(searchQuery) {
    statusListQueryParams.search = searchQuery;
    return this.getStatuses();
  },
  setDaterange(startDate, endDate) {
    statusListQueryParams.startDate = startDate.format(datetimeFormat);
    statusListQueryParams.endDate = endDate.format(datetimeFormat);
    return this.getStatuses();
  },
  setCategories(categories) {
    statusListQueryParams.categories = categories.join(',');
    return this.getStatuses();
  },
  getStatusDetails(id) {
    return Vue.http.get(`${statusListURL}/${id}`);
  },
  getStatusIcon(status) {
    return icons[status.category.toLowerCase()] || icons.other;
  },
  getAllIcons() {
    return icons;
  },
};
