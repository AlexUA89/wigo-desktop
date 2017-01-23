/* global moment */

export default {
  latitude: 50.4501,
  longitude: 30.5234,
  api_root: 'http://wigo.ml/api',
  filtersDefaults: {
    startDate: moment(),
    endDate: moment().add(1, 'days').endOf('day'),
  },
};
