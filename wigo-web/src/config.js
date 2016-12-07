/* global moment */

export default {
  latitude: 50.4501,
  longitude: 30.5234,
  api_root: 'http://54.208.250.42:8080/wigo-server/api',
  api_cors: 'http://54.208.250.42:8080/wigo-server/api/status',
  filtersDefaults: {
    startDate: moment(),
    endDate: moment().add(1, 'days').endOf('day'),
  },
};
