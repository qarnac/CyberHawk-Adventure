// The purpose of this js file is to take care of the creation of the KML files.
// Queries the server for the list of activities active in a specific hunt.
// Once the response is received, it will create the Placemarks on the map.
// Placemarks will contain an image, and the questions/answers from the form.

// Dependencies: wscript.js, json2.js, script.js

// Simply calls the getAllActivitiesFromHunt.php, and sets jsonToKML as the callback function.
function createTeacherKML(){
	ajax("huntid=" + document.getElementById("selecthunt").value,
		PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php",
		jsonToKML);
}


function jsonToKML(serverResponse){
	serverResponse=JSON.parse(serverResponse);
	var kml=initializeKML();                 // This string is going to hold all created KML, hence the simplistic name.
	for(var i=0; i<serverResponse.length; i++){
		kml+=createPlacemark(serverResponse[i]);
	}
	kml+=finishKML();
	console.log(kml);
}

// Made into function so that way anything that wants to be added onto the top of the KML file can easily be added.
function initializeKML(){
	// These lines must be at the top of a KML page according to the google documentation.
	var kml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<kml xmlns=\"http:\/\/www.opengis.net/kml/2.2\">\n<Document>\n"
	return kml;
}

// Anything that you want to add to the KML file AFTER the placemarks should be added here.
function finishKML(){
	return "</Document>\n</kml>";
}
// Is called for every activity response from the server.
// Creates the appropiate <Placemark> for the activity.
function createPlacemark(activity){
	var kml="\t<Placemark>\n"
	kml+="\t\t<name>" + activity["student_id"] + "</name>\n" // As of now, getAllActivitiesFromHunt.php does NOT return student name, so student ID is being used in place.
	kml+="\t\t<Point>\n\t\t\t <coordinates>" + activity.lng + ',' + activity.lat + "</coordinates>\n\t\t</Point>\n"
	// The description is where the bulk of the information goes.
	// Going to start out with small amounts of information in it, and if all looks well, add more.
	
	kml+="\t\t<description>" + activity.mquestion;
	choices=JSON.parse(activity.choices);
	choices=choices.choices; // This might be the ugliest line of code I've ever had to write...
	console.log(choices);
	// Go through the data for the choices, and bold only the one that is correct.
	// Passing as CDATA as it makes the code easier to read and change.
	kml+="<![CDATA[<br />"
	for(var i=0; i<choices.length; i++){
		if(choices[i].ans=="true") kml+="<b>";
		kml+=choices[i].choice + ".\t" + choices[i].content +"<br />";
		if(choices[i].ans=="true") kml+="</b>";
	}
	kml+="]]> </description>"
	/*
	For some reason this code seems to not show up after the KML is parsed by google maps.  Possibly images aren't shown in descriptions?
	This is something I'll look into once I get this script to add more in the description.
	kml+="<![CDATA[<img src=\"" + PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id +"]]></description>\n"
	*/
	kml+="\t</Placemark>\n";
	return kml;
}