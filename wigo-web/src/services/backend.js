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


let statusListURL = 'status';
const options = {};

// let statuses = [];

// function successCallback(response) {
//   console.log('Success Callback');
//   statuses = response.body;
// }

// function errorCallback(response) {
//   console.log('Error happened. Failed to get response from backend.');
//   console.log(response);
// }

// Vue.http.get(statusListURL, [options]).then(successCallback, errorCallback);


export default {
  getStatuses() {
    return Vue.http.get(statusListURL, [options]);
  },
  searchStatuses(searchQuery) {
    statusListURL = updateQueryStringParameter(statusListURL, 'search', searchQuery);
    return Vue.http.get(statusListURL, [options]);
  },
};
