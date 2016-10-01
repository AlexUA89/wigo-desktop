var map = new GMaps({
  el: '#map',
  lat: config.LATITUDE,
  lng: config.LONGITUDE
});

function showCreationMenu(event) {
  menu = $(".creation-menu");
  if (menu.is(":visible")) return;
  lat = event.latLng.lat();
  lng = event.latLng.lng();
  menu.finish().toggle(100);
  menu.css({
      top: event.pixel.y + "px",
      left: event.pixel.x + 10 + "px"
  });
}

function hideCreationMenu(event) {
  // If the clicked element is not the menu
  if (!$(event.target).parents(".creation-menu").length > 0) {   
    $(".creation-menu").hide(100);
  }
}

function createStatus(event, type) {
  console.log("TODO");
}

function drowStatus(status) {
  status.type = 'event'; // XXX: hotfix, waiting for field "type" at backend.
  map.addMarker({
    lat: status.latitude,
    lng: status.longitude,
    title: status.name,
    icon: "static/images/" + status.type + ".png",
    click: function(e) {
      alert(status.text);
    }
  });
}

function init() {
  Status.query().then((response) => {
    statuses = response.body;
    for (var i = 0; i < statuses.length; i++) {
      drowStatus(statuses[i]);
    }
  });
}

GMaps.on('rightclick', map.map, function(event) {
  showCreationMenu(event);
});

$(document).bind("mousedown", function (event) {
  hideCreationMenu(event)
});

init();
