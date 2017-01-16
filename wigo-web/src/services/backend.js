// wrapper around requests to backend
import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../config';
import utils from '../utils';

// configuration
Vue.use(VueResource);
Vue.http.options.root = config.api_root;
Vue.http.headers.common['Access-Control-Allow-Origin'] = config.api_cors;

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
  startDate: null,
  endDate: null,
  search: null,
  categories: null,
};
// restore statusListQueryParams from queryString
const queryString = utils.getQueryString();
function restoreFromQueryString(key) {
  if (Object.prototype.hasOwnProperty.call(queryString, key)) statusListQueryParams[key] = queryString[key];
}
Object.keys(statusListQueryParams).map(key => restoreFromQueryString(key));
if (typeof statusListQueryParams.categories === 'string') {
  statusListQueryParams.categories = statusListQueryParams.categories.split(',');
}
// add start and end date to queryString if they were not defined.
if (statusListQueryParams.endDate === null) {
  statusListQueryParams.endDate = config.filtersDefaults.endDate.format(datetimeFormat);
  utils.addToCurrentLocation('endDate', statusListQueryParams.endDate);
}
if (statusListQueryParams.startDate === null) {
  statusListQueryParams.startDate = config.filtersDefaults.startDate.format(datetimeFormat);
  utils.addToCurrentLocation('startDate', statusListQueryParams.startDate);
}


export default {
  getStatuses() {
    let url = statusListURL;
    function update(param, value) {
      if (value) url = utils.updateQueryStringParameter(url, param, value);
    }
    Object.entries(statusListQueryParams).map(entry => update(...entry));
    return Vue.http.get(url);
  },
  search(searchQuery) {
    statusListQueryParams.search = searchQuery;
    utils.addToCurrentLocation('search', statusListQueryParams.search);
    return this.getStatuses();
  },
  setDaterange(startDate, endDate) {
    statusListQueryParams.startDate = startDate.format(datetimeFormat);
    statusListQueryParams.endDate = endDate.format(datetimeFormat);
    utils.addToCurrentLocation('startDate', statusListQueryParams.startDate);
    utils.addToCurrentLocation('endDate', statusListQueryParams.endDate);
    return this.getStatuses();
  },
  setCategories(categories) {
    statusListQueryParams.categories = categories.join(',');
    utils.addToCurrentLocation('categories', statusListQueryParams.categories);
    return this.getStatuses();
  },
  getStatusDetails(id) {
    return Vue.http.get(`${statusListURL}/${id}`);
  },
  getStatusIcon(status) {
    if (status.kind === 'chat') return icons.chat;
    return icons[status.category.toLowerCase()] || icons.other;
  },
  getSelectedIcons() {
    if (statusListQueryParams.categories === null) return icons;
    const selectedIcons = {};
    function select(category) { selectedIcons[category.toLowerCase()] = icons[category.toLowerCase()]; }
    statusListQueryParams.categories.forEach(category => select(category));
    return selectedIcons;
  },
  statusListQueryParams,
  getStatusComments(status, from) {
    let url = `${statusListURL}/${status.id}/messages`;
    if (from) { url = utils.updateQueryStringParameter(url, 'from', from.format(datetimeFormat)); }
    return Vue.http.get(url);
  },
  getUserDetails(token) {
    return Vue.http.post('login', { fbToken: token });
  },
  postStatusComment(status, commentText, profile) {
    return Vue.http.post(
      `${statusListURL}/${status.id}/messages`,
      { text: commentText, userId: profile.id },
      { headers: { Authorization: `bearer ${profile.token}` } },
    );
  },
};
