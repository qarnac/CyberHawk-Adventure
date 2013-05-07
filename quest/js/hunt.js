// The purpose of this file is for the creation of the new hunts.
// When the New Hunt button is clicked, the createHunt function is called.

// Dependencies:  mapFunctions.js

// Is called when the New Hunt button is clicked.
// Checks if the browser can find out users location, if so, use that for the coords to load the google map.
// Otherwise, we center it at the default coords.
function createhunt() {
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
	ajax("id=" + document.getElementById("selecthunt").value, GLOBALS.PHP_FOLDER_LOCATION + "getStudentForHunt.php", function(serverResponse){
		if(serverResponse=="false"){
			document.getElementById("student_username_label").innerHTML="";
			document.getElementById("student_password_label").innerHTML="";
		}else{
			var student=JSON.parse(serverResponse);
			document.getElementById("student_username").innerHTML=student.username;
			document.getElementById("student_password").innerHTML=student.password;
		}
	});
	document.getElementById("title").innerHTML=hunt.title;
	document.getElementById("dueDate").innerHTML=hunt.dueDate;
}

// Is called by the Hunt Info button from the teacher view.
function viewHuntInformation(){
	document.getElementById("students").style.display="none";
	document.getElementById("activity").innerHTML=GLOBALS.createHunt;
	document.getElementById("activity").style.display="none";
	document.getElementById("activity").style.display="block";
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)];
	document.getElementById("title").value=hunt.title;
	document.getElementById("dateOfTrip").value=hunt.dateofTrip;
	var additionalQuestions=JSON.parse(hunt.additionalQuestions);
	if(additionalQuestions.questiona) document.getElementById("additionalQuestion1").value=additionalQuestions.questiona;
	if(additionalQuestions.questionb) document.getElementById("additionalQuestion2").value=additionalQuestions.questionb;
	if(additionalQuestions.questionc) document.getElementById("additionalQuestion3").value=additionalQuestions.questionc;
	document.getElementById("editLatLngButton").style.display="none";
	document.getElementById("submit").style.display="none";
	document.getElementById("editHunt").value="Map View";
	document.getElementById("editHunt").onclick=function(){
		huntsel(document.getElementById("selecthunt").value);
		document.getElementById("editHunt").onclick=viewHuntInformation;
		document.getElementById("editHunt").value="View Hunt Info";
	}
	displayHuntBounds();
}

// Returns which option from the select is the selected hunt.
function getHuntSelectNumber(id){
	// If the selecthunt option exists, then the only hunts in sessionStorage.hunts are the one that the student or teacher is a part of.
	if(document.getElementById("selecthunt"))
		for(var i=0; i<document.getElementById("selecthunt").options.length; i++){
			if(document.getElementById("selecthunt").options[i].value==id) return i-1;
		}
	// Otherwise, the selecthunt doesn't exist (using publicView) and we must loop through all of the hunts in sessionStorage.
	var hunts=JSON.parse(sessionStorage.hunts);
	for(var i=0; i<hunts.length; i++){
		if(hunts[i].id==id) return i;
	}
}