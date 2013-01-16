// The purpose of this file is for the creation of the new hunts.
// When the New Hunt button is clicked, the createHunt function is called.

// Dependencies:  mapFunctions.js

// Is called when the New Hunt button is clicked.
// Checks if the browser can find out users location, if so, use that for the coords to load the google map.
// Otherwise, we center it at the default coords.
function createhunt () {
	document.getElementById("selecthunt").value=0;
	if(document.getElementById("slist")) document.getElementById("slist").style.display="none";
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
	newHuntMap(initializeMap(GLOBALS.DEFAULT_LAT, GLOBALS.DEFAULT_LNG));
}


// Creates a new map, and creates a GoToControlBox for it.  The box can also have it's edges dragged to move it.
function newHuntMap(map){
	// Creates the rectangle at the center of the map, and is the default size (according to the default variable).
	var southwest=new google.maps.LatLng(map.getCenter().lat()-GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()-GLOBALS.DEFAULT_RECT_SIZE/2);
	var northeast=new google.maps.LatLng(map.getCenter().lat()+GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()+GLOBALS.DEFAULT_RECT_SIZE/2);
	var bounds=new google.maps.LatLngBounds(southwest, northeast);
	rectangle=createRectangleOverlay(map, bounds);
	rectangle.setEditable(true);
	createGotoControl(map, rectangle.getBounds().getCenter(), function(){}, rectangle, true)
	google.maps.event.addListener(rectangle, "bounds_changed", function(event){
		updateWidthHeight(rectangle.getBounds());
	});
}

// Fills huntInformation.html
function fillHuntInformation(){
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)];
	document.getElementById("title").innerHTML=hunt.title;
	document.getElementById("dueDate").innerHTML=hunt.dueDate;
}

// Is called by the Hunt Info button from the teacher view.
function viewHuntInformation(){
	document.getElementById("activity").innerHTML=GLOBALS.huntInformation;
	setTimeout(fillHuntInformation, 75);
	
}

// Returns which option from the select is the selected hunt.
function getHuntSelectNumber(id){
	for(var i=0; i<document.getElementById("selecthunt").options.length; i++){
		if(document.getElementById("selecthunt").options[i].value==id) return i-1;
	}
}