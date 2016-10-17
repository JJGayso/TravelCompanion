$(document).ready(function() {

});

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.465542, lng: -87.375924},
        zoom: 11
    });
    google.maps.event.trigger(map, "resize");
}