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
  created() {
    /* global FB */
    /* global window */
    /* global document */
    console.log('created main');
    function init() {
      FB.init({
        appId: '303606623329436',
        xfbml: true,
        version: 'v2.8',
      });

      // This function should be here, inside window.fbAsyncInit
      FB.getLoginStatus((response) => {
        console.log(response);
        FB.api('/me', (me) => {
          console.log('me');
          console.log(me);
        });
        // FB.logout();
        // FB.login((login) => {
        //   console.log(login);
        // });
      });
    }
    window.fbAsyncInit = init;

    function load(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      const js = d.createElement(s);
      js.id = id;
      js.src = 'http://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
    load(document, 'script', 'facebook-jssdk');
  },
});
