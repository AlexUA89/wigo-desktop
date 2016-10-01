config = {};

config.LATITUDE = 50.4501;
config.LONGITUDE = 30.5234;
config.vue = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  },
  http: {
    root: 'http://46.101.106.144:8080/wigo-server/api',
    headers: {
      'Authorization': 'Basic YXBpOnBhc3N3b3Jk',  // not used yet
      'Access-Control-Allow-Origin': 'http://46.101.106.144:8080/wigo-server/api/status'
    }
  },
});
