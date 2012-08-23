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
	createGotoControl(map, rectangle.getBounds().getCenter(), newHuntMapSubmit, rectangle, true)
	google.maps.event.addListener(rectangle, "bounds_changed", function(event){
		updateWidthHeight(rectangle.getBounds());
	});
}

// This is the function for the submit button in the GoToControl Box.
function newHuntMapSubmit(){
	ajax("GET", "../quest/html/createHunt.html", displayHuntForm);
}

// This is the callback function for the ajax call for the createHunt.html.
function displayHuntForm(serverResponse){
	var bounds=rectangle.getBounds();
	$('activity').innerHTML=serverResponse;
	document.getElementById("minLat").innerHTML=bounds.getSouthWest().lat();
	document.getElementById("minLng").innerHTML=bounds.getSouthWest().lng();
	document.getElementById("maxLat").innerHTML=bounds.getNorthEast().lat();
	document.getElementById("maxLng").innerHTML=bounds.getNorthEast().lng();
	var today=new Date();
	document.getElementById("endDate").innerHTML=(today.getMonth()+1) + "/" + today.getDate() +"/" + today.getFullYear();
}

//Is called when the submit button is clicked on the newHunt.html form.
function submitNewHunt(){
	var date=Date.parse(document.getElementById("endDate").value);
	date=new Date(date);
	var dateString=date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	ajax("title=" + document.getElementById("huntTitle").value +
		"&endDate=" + dateString +
		"&minLat=" + document.getElementById("minLat").value +
		"&minLng=" + document.getElementById("minLng").value +
		"&maxLat=" + document.getElementById("maxLat").value +
		"&maxLng=" + document.getElementById("maxLng").value,
		PHP_FOLDER_LOCATION + "createHunt.php", huntSubmitted);
		return false;
}

function huntSubmitted(serverResponse){
	if(serverResponse=="success") console.log("hooray!");
	else console.log(serverResponse);
}