// The purpose of this js file is to take care of the creation of the KML files.
// Queries the server for the list of activities active in a specific hunt.
// Once the response is received, it will create the Placemarks on the map.
// Placemarks will contain an image, and the questions/answers from the form.

// Dependencies: wscript.js, json2.js, script.js, and google API v3.

// Simply calls the getAllActivitiesFromHunt.php, and sets jsonToMap as the callback function.
function createTeacherMap(){
	ajax("huntid=" + document.getElementById("selecthunt").value,
		PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php",
		jsonToMap);
}

// Takes the response from getAllActivitiesFromHunt.php and turns it into a KML file.
function jsonToMap(serverResponse){
	if(document.getElementById("slist")!=null) document.getElementById("slist").style.display="none";
	serverResponse=JSON.parse(serverResponse);
	var hunts=JSON.parse(sessionStorage.hunts);
	var selectedHunt;
	for(var i=0; i<hunts.length; i++){
		if(document.getElementById("selecthunt").value==hunts[i].id){
			selectedHunt=i;
			break;
		}
	}
	var bounds=new google.maps.LatLngBounds(new google.maps.LatLng(hunts[selectedHunt].minlat, hunts[selectedHunt].minlng), new google.maps.LatLng(hunts[selectedHunt].maxlat, hunts[selectedHunt].maxlng));
	var map=initializeMap(bounds.getCenter().lat(), bounds.getCenter().lng());
	createRectangleOverlay(map, bounds);
	document.getElementById("mapButton").value="List View";
	for(var i=0; i<serverResponse.length; i++){
		createPlacemark(serverResponse[i], map);
	}
	
}

// Is called for every activity response from the server.
// Adds a Placemark to the map.
function createPlacemark(activity, map){
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(activity.lat, activity.lng),
		title:activity.student_id
	});
	marker.setMap(map);
	google.maps.event.addListener(marker, "click", function(){
		// This sets it up so that way an infowindow pops up and shows the text that we just created in the text variable above.
		info=new google.maps.InfoWindow();
		info.setContent(generateActivityView(activity, false, document.getElementsByName("partner_names").length));
		info.setPosition(new google.maps.LatLng(activity.lat, activity.lng));
		info.open(map);
	});
}

// This is the function called by the view Map button.
// It's responsible for setting up the display of the map, and then setting up the display of the list if the map already exists.
function mapListButton(){
	if(document.getElementById("map_canvas")==null) createTeacherMap();
	else {
	// Currently, not a lot is done to show the list again, so it doesn't need to be wrapped into a function.
		document.getElementById("activity").removeChild(document.getElementById("map_canvas"))
		 for ( var i = 0; i < activityList.length; i++) {
			$('activity').appendChild(generateActivityView(activityList[i], false, i));
		}
		document.getElementById("mapButton").value="Map View";
		}
}
