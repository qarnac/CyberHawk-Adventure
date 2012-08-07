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
	var text= activity["firstname"] + " " + activity["lastname"]; // As of now, getAllActivitiesFromHunt.php does NOT return student name, so student ID is being used in place.
	text+="<![CDATA[<br /> <br />"
	text+="<div><img src=\"" + PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id +"\" width=\"100px\" height=\"100px\" style=\"float:left\"/>\n";
	text+=activity.mquestion + "<br />";
	choices=JSON.parse(activity.choices);
	choices=choices.choices; // This might be the ugliest line of code I've ever had to write...
	// Go through the data for the choices, and bold only the one that is correct.
	for(var i=0; i<choices.length; i++){
		var side=(i%2)? "right" : "left"
		text+="<div style=\"float:" + side + "\">";
		if(choices[i].ans=="true") text+="<b>";
		text+=choices[i].choice + ".\t" + choices[i].content;
		// We want 2 questions on a line, so we tab every other.
		if(choices[i].ans=="true") text+="</b>";
		text+="</div>";
		if(side=="right") text+="<br />";
	}
	text+="</div> <br /> <br />"
	
	text+="What is this picture about? <br />" + activity.aboutmedia + "<br />";
	text+="Why did you choose this picture? <br />" + activity.whythis + "<br />";
	text+="How does this picture show what you have learned about in your science class? <br />" + activity.howhelpfull + "<br />";
	text+="What is a question you have about this picture? <br />" + activity.yourdoubt + "<br />";
	console.log(text);
	
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
	div.style.width="100%";
	div.style.display = 'block';
	div.style.position = 'fixed';
	div.style.top = "0px";
	div.style.left = "0px";
	document.getElementById("slist").style.display="none";
	document.getElementById("mapButton").value="List View";
	map = new google.maps.Map(div, myOptions);
}
// This is the function called by the view Map button.
// It's responsible for setting up the display of the map, and then setting up the display of the list if the map already exists.
function mapListButton(){
	if(document.getElementById("map_canvas")==null) createTeacherMap();
	else {
	// Currently, not a lot is done to show the list again, so it doesn't need to be wrapped into a function.
		document.getElementById("activity").removeChild(document.getElementById("map_canvas"))
		document.getElementById("slist").style.display="block";
		document.getElementById("mapButton").value="Map View";
		}
}
