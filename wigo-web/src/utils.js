/* global window */

export default {
  updateQueryStringParameter(uri, key, value) {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) return uri.replace(re, `$1${key}=${value}$2`);
    return `${uri}${separator}${key}=${value}`;
  },
  addToCurrentLocation(key, value) {
    const url = this.updateQueryStringParameter(window.location.href, key, value);
    window.history.pushState('', '', url);
  },
  getQueryString() {
    const queryString = {};
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');
          // If first entry with this name
      if (typeof queryString[pair[0]] === 'undefined') {
        queryString[pair[0]] = decodeURIComponent(pair[1]);
          // If second entry with this name
      } else if (typeof queryString[pair[0]] === 'string') {
        const arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
        queryString[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return queryString;
  },
};
