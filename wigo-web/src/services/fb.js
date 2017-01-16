/* global FB */
/* global window */
/* global document */
/* global localStorage */
import backend from './backend';

const profile = {
  activated: false,
};

function initProfile(fbToken) {
  backend.getUserDetails(fbToken).then((response) => {
    if (response.status !== 200) {
      console.log('User is not initialized');
    } else {
      localStorage.setItem('fbToken', fbToken);
      profile.activated = true;
      profile.name = response.body.user.name;
      profile.nickname = response.body.user.nickname;
      profile.id = response.body.user.id;
      profile.token = response.body.token;
    }
  });
}

if (localStorage.getItem('fbToken')) {
  initProfile(localStorage.getItem('fbToken'));
}

function init() {
  FB.init({
    appId: '303606623329436',
    xfbml: true,
    version: 'v2.8',
  });
}
window.fbAsyncInit = init;

function load(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  const js = d.createElement(s);
  js.id = id;
  js.src = 'http://connect.facebook.net/en_US/sdk.js';
  js.async = true;
  fjs.parentNode.insertBefore(js, fjs);
}

export default {
  init() {
    load(document, 'script', 'facebook-jssdk');
  },
  login(callback) {
    FB.login((response) => {
      if (response.status !== 'connected') {
        console.log('Failed to login');
        return;
      }
      initProfile(response.authResponse.accessToken);
      callback(response);
    });
  },
  logout() {
    localStorage.removeItem('fbToken');
    profile.activated = false;
    FB.logout();
  },
  profile,
};
