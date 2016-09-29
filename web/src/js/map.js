var map = new GMaps({
  el: '#map',
  lat: config.LATITUDE,
  lng: config.LONGTITUDE,
});

map.addListener("dblclick", function (e) { 
   log("Double Click"); 
});
// alert('QQQ');

map.addMarker({
  lat: 50.4501,
  lng: 30.5234,
  title: 'Lima',
  icon: "static/images/burger.png",
  click: function(e) {
    alert('You clicked in this marker');
  }
});
