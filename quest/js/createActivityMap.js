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

// Takes the response from getAllActivitiesFromHunt.php and displays it on the map.
function jsonToMap(serverResponse){
	if(document.getElementById("slist")!=null) document.getElementById("slist").style.display="none";
	document.getElementById("mapButton").value="List View";
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
	for(var i=0; i<serverResponse.length; i++){
		createPlacemark(serverResponse[i], map);
	}
}

// Is called for every activity response from the server.
// Adds a Placemark to the map.
// isStudent==0==false, teacher view.
// isStudent==1==true, student view.
// isStudent==2, public view.
// TODO: Create an enum for the integer values of isStudent to help grant more clarity when checking isStudent.
// Returns the placemark.
function createPlacemark(activity, map, isStudent){
	if(isStudent==undefined) isStudent=0;
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(activity.lat, activity.lng),
		title:activity.student_id
	});
	marker.setMap(map);
	// By storing the infoWindows on the map itself, there can only be one active infoWindow at a time.
	if(map.info==undefined) map.info=new google.maps.InfoWindow();
	map.info.open(map);
	// This sets it up so that way an infowindow pops up and shows the text that we just created in the text variable above.
	google.maps.event.addListener(marker, "click", function(){
		map.info.close();
		map.info.setContent(generateActivityView(activity, isStudent, document.getElementsByName("partner_names").length));
		map.info.open(map);
		map.info.setPosition(new google.maps.LatLng(activity.lat, activity.lng));
	});
	return marker;
}

// This is the function called by the view Map button.
// It's responsible for setting up the display of the map, and then setting up the display of the list if the map already exists.
function mapListButton(){
	if(document.getElementById("map_canvas")==null) createTeacherMap();
	else {
	// Currently, not a lot is done to show the list again, so it doesn't need to be wrapped into a function.
		document.getElementById("activity").removeChild(document.getElementById("map_canvas"))
		var slist=document.getElementById("slist");
		// If there is more than one student, then we want to display the list of students.
		if(slist!=undefined && slist.options.length>1) slist.style.display="block";
		// If there is only one student, automatically selects the first student and calls the onchange function.
		// Does not display the slist.
		else{
			slist.value=slist.options[0].value;
			slist.onchange();
		}
		document.getElementById("mapButton").value="Map View";
		}
}
