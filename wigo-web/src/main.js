// allow to use jquery everywhere
// import 'expose?$!expose?jQuery!jquery';
// import 'expose?moment!moment';

import Vue from 'vue';
import App from './App';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
