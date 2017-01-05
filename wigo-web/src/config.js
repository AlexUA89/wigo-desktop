/* global moment */

export default {
  latitude: 50.4501,
  longitude: 30.5234,
  api_root: 'http://52.90.115.129:8080/wigo-server/api',
  api_cors: 'http://52.90.115.129:8080/wigo-server/api/status',
  filtersDefaults: {
    startDate: moment(),
    endDate: moment().add(1, 'days').endOf('day'),
  },
};
