/* global window */

export default {
  updateQueryStringParameter(uri, key, value) {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) return uri.replace(re, `$1${key}=${value}$2`);
    return `${uri}${separator}${key}=${value}`;
  },
  deleteQueryStringParameter(url, parameter) {
    // prefer to use l.search if you have a location/link object
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter);
      const pars = urlparts[1].split(/[&;]/g);

      // reverse iteration as may be destructive
      for (let i = pars.length - 1; i > 0; i -= 1) {
        // idiom for string.startsWith
        if (pars[i].lastIndexOf(`${prefix}=`, 0) !== -1) {
          pars.splice(i, 1);
        }
      }
      const joinedPars = pars.join('&');
      return urlparts[0] + (pars.length > 0 ? `?${joinedPars}` : '');
    }
    return url;
  },
  addToCurrentLocation(key, value) {
    const url = this.updateQueryStringParameter(window.location.href, key, value);
    window.history.pushState('', '', url);
  },
  removeFromCurrentLocation(key) {
    const url = this.deleteQueryStringParameter(window.location.href, key);
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
