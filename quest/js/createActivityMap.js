// The purpose of this js file is to take care of the creation of the KML files.
// Queries the server for the list of activities active in a specific hunt.
// Once the response is received, it will create the Placemarks on the map.
// Placemarks will contain an image, and the questions/answers from the form.

// Dependencies: wscript.js, json2.js, script.js, and google API v3.

// Simply calls the getAllActivitiesFromHunt.php, and sets jsonToMap as the callback function.
function createTeacherMap(){
	ajax("huntid=" + document.getElementById("selecthunt").value,
		GLOBALS.PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php",
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
	// This sets it up so that way an infowindow pops up and shows the text that we just created in the text variable above.
	google.maps.event.addListener(marker, "click", function(){
	if(map.info.getMap==map) map.info.close();
		var div=createElement("div", "");
		div.className="infoWindow";
		// If there is already an existing infoWindow, this if will go ahead and clear out it's content.
		// This prevents issues when using document.getElementsByName() to edit contents within an infoWindow.
		if(document.getElementsByClassName("infoWindow").length)
			document.getElementsByClassName("infoWindow")[0].parentNode.removeChild(document.getElementsByClassName("infoWindow")[0])
		div.appendChild(generateActivityView(activity, isStudent, document.getElementsByName("partner_names").length));
		map.info.setContent(div);
		map.info.open(map);
		map.info.setPosition(new google.maps.LatLng(activity.lat, activity.lng));
	});
	return marker;
}

// This is the function called by the view Map button.
// It's responsible for setting up the display of the map, and then setting up the display of the list if the map already exists.
function mapListButton(){
	document.getElementById("editHunt").value="View Hunt Info";
	if(document.getElementById("map_canvas")==null || document.getElementById("map_canvas").style.display=="none") createTeacherMap();
	else {
	// Currently, not a lot is done to show the list again, so it doesn't need to be wrapped into a function.
		// If the map_canvas exists, remove it.
		if(document.getElementById("map_canvas")!=null) document.getElementById("map_canvas").style.display="none";
		else{
			
		}
		var slist=document.getElementById("slist");
		// If there is more than one student, then we want to display the list of students.
		if(slist!=undefined && slist.options.length>1){
			slist.style.display="block";
			document.getElementById("students").style.display="block";
		}
		// If there is only one student, automatically selects the first student and calls the onchange function.
		// Does not display the slist.
		else if(slist==undefined){
			huntsel();
			document.getElementById("mapButton").onclick();
			
		}else{
			slist.value=slist.options[0].value;
			slist.onchange();
			slist.style.display="block";
			document.getElementById("students").style.display="block";
		}
		document.getElementById("mapButton").value="Map View";
		}
}
