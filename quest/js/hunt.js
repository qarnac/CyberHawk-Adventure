// The purpose of this file is for the creation of the new hunts.
// When the New Hunt button is clicked, the createHunt function is called.

// Dependencies:  mapFunctions.js

var DEFAULT_LAT=33.128760;
var DEFAULT_LNG=-117.159450;
var DEFAULT_RECT_SIZE=.25;

// Is called when the New Hunt button is clicked.
// Checks if the browser can find out users location, if so, use that for the coords to load the google map.
// Otherwise, we center it at the default coords.
function createhunt () {
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(receivedLocation, noLocation);
	}
	else {
		noLocation();
	}
}

function receivedLocation(position){
	newHuntMap(initializeMap(position.coords.latitude, position.coords.longitude));
}
function noLocation(){
	newHuntMap(initializeMap(DEFAULT_LAT, DEFAULT_LNG));
}


// Creates a new map, and creates a GoToControlBox for it.  The box can also have it's edges dragged to move it.
function newHuntMap(map){
	// Creates the rectangle at the center of the map, and is the default size (according to the default variable).
	var southwest=new google.maps.LatLng(map.getCenter().lat()-DEFAULT_RECT_SIZE/2, map.getCenter().lng()-DEFAULT_RECT_SIZE/2);
	var northeast=new google.maps.LatLng(map.getCenter().lat()+DEFAULT_RECT_SIZE/2, map.getCenter().lng()+DEFAULT_RECT_SIZE/2);
	var bounds=new google.maps.LatLngBounds(southwest, northeast);
	rectangle=createRectangleOverlay(map, bounds);
	rectangle.setEditable(true);
	createGotoControl(map, rectangle.getBounds().getCenter(), newHuntSubmit, rectangle, true)
	google.maps.event.addListener(rectangle, "bounds_changed", function(event){
		updateWidthHeight(rectangle.getBounds());
	});
}

// This is the function for the submit button in the GoToControl Box.
// Currently, does nothing.
function newHuntSubmit(){

}


