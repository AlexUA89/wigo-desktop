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

const datetimeFormat = 'YYYY-MM-DDTHH:mm:ss[Z]';
const statusListURL = 'status';
const statusListQueryParams = {
  startDate: config.filtersDefaults.startDate.format(datetimeFormat),
  endDate: config.filtersDefaults.endDate.format(datetimeFormat),
  search: null,
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
  getStatusDetails(id) {
    return Vue.http.get(`${statusListURL}/${id}`);
  },
};
