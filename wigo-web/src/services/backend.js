// wrapper around requests to backend
import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../config';

// configuration
Vue.use(VueResource);
Vue.http.options.root = config.api_root;
Vue.http.headers.common['Access-Control-Allow-Origin'] = config.api_cors;

const statusListURL = 'status';
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
  getStatuses: Vue.http.get(statusListURL, [options]),
};
