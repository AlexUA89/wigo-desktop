var map = new GMaps({
  el: '#map',
  lat: config.LATITUDE,
  lng: config.LONGTITUDE,
  // disableDoubleClickZoom: true,
});


// google.maps.event.addListener(map, "rightclick", function(event) {
//     alert('QQQ');
//     var lat = event.latLng.lat();
//     var lng = event.latLng.lng();
//     // populate yor box/field with lat, lng
//     alert("Lat=" + lat + "; Lng=" + lng);
// });



GMaps.on('rightclick', map.map, function(event) {
  var index = map.markers.length;
  var lat = event.latLng.lat();
  var lng = event.latLng.lng();

  
  menu = $(".custom-menu");
  if (menu.is(":visible")) return;
  // Show context menu
  menu.finish().toggle(100);
  menu.css({
      top: event.pixel.y + "px",
      left: event.pixel.x + "px"
  });
});

// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {
    
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {
        
        // Hide it
        $(".custom-menu").hide(100);
    }
});

// map.addMarker({
//   lat: 50.4501,
//   lng: 30.5234,
//   title: 'Lima',
//   icon: "static/images/burger.png",
//   click: function(e) {
//     alert('You clicked in this marker');
//   }
// });


// map.setContextMenu({
//   control: 'map',
//   options: [{
//     title: 'Add marker',
//     name: 'add_marker',
//     action: function(e) {
//       this.addMarker({
//         lat: e.latLng.lat(),
//         lng: e.latLng.lng(),
//         title: 'New marker'
//       });
//     }
//   }, {
//     title: 'Center here',
//     name: 'center_here',
//     action: function(e) {
//       this.setCenter(e.latLng.lat(), e.latLng.lng());
//     }
//   }]
// });
