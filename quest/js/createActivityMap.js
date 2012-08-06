// The purpose of this js file is to take care of the creation of the KML files.
// Queries the server for the list of activities active in a specific hunt.
// Once the response is received, it will create the Placemarks on the map.
// Placemarks will contain an image, and the questions/answers from the form.

// Dependencies: wscript.js, json2.js, script.js, geocompress.js and google API v3.

// Simply calls the getAllActivitiesFromHunt.php, and sets jsonToMap as the callback function.
function createTeacherMap(){
	ajax("huntid=" + document.getElementById("selecthunt").value,
		PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php",
		jsonToMap);
}

// Takes the response from getAllActivitiesFromHunt.php and turns it into a KML file.
function jsonToMap(serverResponse){
	serverResponse=JSON.parse(serverResponse);
	initializeMap(serverResponse[0]);
	for(var i=0; i<serverResponse.length; i++){
		createPlacemark(serverResponse[i]);
	}
}

// Is called for every activity response from the server.
// Adds a Placemark to the map.
function createPlacemark(activity){
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(activity.lat, activity.lng),
		title:activity.student_id
	});
	marker.setMap(map);
	
	// Text is used in the onclick function, but does not need to be generated every single time we click, so it is kept outside of the actual function.
	var text= activity["student_id"] // As of now, getAllActivitiesFromHunt.php does NOT return student name, so student ID is being used in place.
	text+="<![CDATA[<br />"
	text+="<br />" + activity.mquestion + "<br />";
	choices=JSON.parse(activity.choices);
	choices=choices.choices; // This might be the ugliest line of code I've ever had to write...
	// Go through the data for the choices, and bold only the one that is correct.
	for(var i=0; i<choices.length; i++){
		if(choices[i].ans=="true") text+="<b>";
		text+=choices[i].choice + ".\t" + choices[i].content +"<br />";
		if(choices[i].ans=="true") text+="</b>";
	}
	text+="<img src=\"" + PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id +"\" width=\"100px\" height=\"100px\"/>\n";
	
	
	// When the Placemark is clicked, we want to show all of the information about it.
	google.maps.event.addListener(marker, "click", function(){
	// This sets it up so that way an infowindow pops up and shows the text that we just created in the text variable above.
	info=new google.maps.InfoWindow();
	info.setContent(text);
	info.setPosition(new google.maps.LatLng(activity.lat, activity.lng));
	info.open(map);
	});
}


// Initializes the map for the creation of the Activity Map.
function initializeMap(activity){
	$('activity').innerHTML="";
		var myOptions = {
		center :new google.maps.LatLng(activity.lat,activity.lng),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	div=document.createElement("div");
	div.setAttribute("id", "map_canvas");
	document.getElementById("activity").appendChild(div);
	div.style.height="500px";
	div.style.width="70%";
	div.style.display = 'block';
	div.style.position = 'fixed';
	div.style.top = "0px";
	div.style.left = "0px";
	map = new google.maps.Map(div, myOptions);
}
