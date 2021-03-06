// publicView.js
// Created by Jeffrey Rackauckas

//Dependencies:  mapFunctions.js, createActivityMap.js & Google API v3.

// The purpose of this file is to control the new public index page.

// Is the callback function for when index.html finishes loading.  Recieves getAllHunts.php as the parameter.
// The purpose of this function is to initialize the public view for users.  Thus it needs
// to initialize two different areas:  Both the map area, and the list area.
// Map area must be initialized first because the current plan is to only put a hunt in the list
// if it is visible on the map.
function initializePublicMapDisplay(hunts){
	// hunts needs to be parsed in order to actually be usable.
	var hunts=JSON.parse(hunts);
	
	// Start off by creating the map.
	// Sadly can't use the function createMap because it will automatically put the map in the activity div.
	$('map_canvas').innerHTML="";
	var myOptions = {
		center :new google.maps.LatLng(GLOBALS.DEFAULT_LAT,GLOBALS.DEFAULT_LNG),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	// TODO:  Move div styling to the HTML file.  But since the styling will most likely be changed in the future, this isn't a major concern.
	div=document.getElementById("map_canvas");
	div.style.height="600px";
	div.style.display = 'block';
	div.style.position = 'fixed';
	div.style.top = "0px";
	div.style.left = "0px";
	
	sessionStorage.hunts=ajax("GET", GLOBALS.PHP_FOLDER_LOCATION + "getAllHunts.php", function(serverResponse){sessionStorage.hunts=serverResponse;});
	// odd name because I'm pretty sure at some point there is a global variable named map.
	var mapInstance = new google.maps.Map(div, myOptions);
	
	// Loop through all of the hunts and create the overlays to display them on the map.
	// Store all of the Rectangles in an array so we can hide/display them at later times.
	var rectangles=new Array();
	for(var i=0; i<hunts.length; i++){
		// Second parameter is the condensed creation of the hunt bounds.
		rectangles.push(createRectangleOverlay(mapInstance, new google.maps.LatLngBounds(new google.maps.LatLng(hunts[i].minlat, hunts[i].minlng), new google.maps.LatLng(hunts[i].maxlat, hunts[i].maxlng))));
	}
	// Now to set up the list.
	var table=document.getElementById("huntTable");
	// Anytime the map gets moved, we want to update what hunts the list is displaying.
	google.maps.event.addListener(mapInstance, 'bounds_changed', function(){displayVisibleHunts(mapInstance, hunts, table, rectangles);});
	// Give the search button the proper parameters when clicked.
	document.getElementById("searchButton").onclick=function(){searchHunts(document.getElementById("searchArea"), hunts, mapInstance, rectangles);};
	// All this statement does is say that if the user presses the enter key in the searchArea, we want to search for the hunt.
	document.getElementById("searchArea").onkeypress=function(event){
		event= event || window.event;
		if(event.keyCode==13){
			var searchArea=document.getElementById("searchArea");
			searchHunts(document.getElementById("searchArea"), hunts, mapInstance, rectangles); 
			return false;
			}
	};
	
}

// Called from: initializePublicMapDisplay
// The purpose of this function is to cycle through all of the hunts, and add only the visible hunts to the list view. 
// If a hunt is not visible on the map currently, it simply is not shown on the list.
function displayVisibleHunts(map, hunts, table, rectangles){
	bounds=map.getBounds();
	// Deletes all rows except the header row from the table.
	while(table.rows.length>1) table.deleteRow(1);
	// Loop through each hunt individually.
	for(var i=0; i<hunts.length; i++){
		// So it seems like there is no way to check if one bounds contains another bounds, so the simple test is going to be to check whether any of the 4 corners, or the center are in the map bounds.
		// Obviously, this is a terrible workaround.  It does have bugs that it will create (What if no corners nor the center are visible, but there still is a portion that is visible?).
		// This method will fail if the user zooms in too much.
		// TODO:  Fix the bounds checking.
		if(bounds.contains(new google.maps.LatLng(hunts[i].minlat, hunts[i].minLng))
			|| bounds.contains(new google.maps.LatLng(hunts[i].minlat, hunts[i].maxlng))
			|| bounds.contains(new google.maps.LatLng(hunts[i].maxlat, hunts[i].minlng))
			|| bounds.contains(new google.maps.LatLng(hunts[i].maxlat, hunts[i].maxlng))
			// Check center last since it requires the most proccessing.
			|| bounds.contains(new google.maps.LatLngBounds(new google.maps.LatLng(hunts[i].minlat, hunts[i].minlng), new google.maps.LatLng(hunts[i].maxlat, hunts[i].maxlng)).getCenter()))
		{
			addHuntToViewTable(map, hunts[i], table, rectangles, i);
		}
	}

}

// This function is the function responsible for adding hunts to table on the public view page.
// Is passed four different parameters, the google map object, the hunt to add to the table,
// the table itself, the array of rectangles displayed on the map, and which hunt the hunt is in hunts.
function addHuntToViewTable(map, hunt, table, rectangles, huntValue){
				// For some reason, -1 is the parameter you pass to indicate you want the row inserted at the end.
				var row=table.insertRow(-1);
				row.insertCell(-1).innerHTML=hunt.title;
				row.insertCell(-1).innerHTML=hunt.firstname + " " + hunt.lastname;
				// This is the rectangle the user currently has selected.
				if(rectangles[huntValue].fillColor=="#FFFF00") row.className="highlight";
				// Each row needs it's own rectNumber stored in itself, so that way each onclick function can have it's own rectNumber.
				row.rectNumber=huntValue;
				row.hunt=hunt;
				// Store things in local memory so it's usable in the onclick function.
				var map=map;
				// The first time a row is clicked, it selects the hunt, and then unselects all other hunts.
				// If the row is clicked again, it'll zoom into that hunt, and display the activities for that hunt.
				row.onclick=function(){
					deselectAllHunts(rectangles,this);			
					if(this.className==""){
						// Change the color of the table row, and the hunt display on the map.
						this.className="highlight";
						var rectOptions = {
							strokeColor : "#FFFF00",
							fillColor : "#FFFF00"
						};
						rectangles[this.rectNumber].setOptions(rectOptions);
					} else if(this.className=="highlight"){
						document.getElementById("studentLogin").disabled=false;
						map.panTo(rectangles[this.rectNumber].getBounds().getCenter());
						// Get all of the activities that correspond that hunt.
						ajax("huntid="+this.hunt.id, GLOBALS.PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php", function(serverResponse){
							// Loop through all of the hunts and plot only the hunts with a status of completed.
							if(map.info!=undefined && map.info.getMap()==map) map.info.close();
							activities=JSON.parse(serverResponse);
							rectangles.placemarks=new Array();
							for(var i=0; i<activities.length; i++){
								// TODO: Get rid of displaying the unverified activities.
								// Currently making it so all activities are displayed.
								// if(activities[i].status=="Verified" || activities[i].status=="unverified"){
									rectangles.placemarks.push(createPlacemark(activities[i], map, 2));
								//}
							}
						});
					}
				};
}

// Called by the Teacher Login and Student Login buttons.
// Fills in the login Area with both the labels and the inputs for the username/password.
// Is passed whether the user is a student or a teacher.
function createLoginDisplay(isTeacher){
	var who=(isTeacher)? "teacher":"students";
	// Find out who the parent hunt is if a hunt is selected.
	table=document.getElementById("huntTable")
	var parent=0;
	for(var i=0; i<table.rows.length; i++){
		if(table.rows[i].className=="highlight"){
			parent=table.rows[i].hunt.id;
			break;
		}
	}
	window.location="login.php?who="+who +"&parentHunt=" + parent;
/*
	This is the old method of creating a login for students/teachers.
	When the button is pushed, it creates a username/password display area, and a submit button.
	Possibly we can delete this now?
	// Create the 4 HTML elements.
	document.getElementById("loginArea").innerHTML="";
	var usernameLabel=document.createElement("label");
	usernameLabel.innerHTML="username:"
	var usernameText=document.createElement("input");
	var passwordLabel=document.createElement("label");
	passwordLabel.innerHTML="Password:"
	var passwordText=document.createElement("input");
	passwordText.type="password";
	var button=document.createElement("button");
	button.innerHTML="Submit!"
	// Because the php file uses a string for isTeacher, convert it to a string.
	var who=(isTeacher)? "teacher":"students";
	// Create the onsubmit function for the login submit button.
	button.onclick=function(){
								var table=document.getElementById("huntTable");
								var parent=0;
								// parentHunt parameter is only used if the user is a student, so we only check for the currently
								// selected hunt if they're trying to log in as a student.
								if(!isTeacher)
									for(var i=0; i<table.rows.length; i++){
										if(table.rows[i].className=="highlight"){
											parent=table.rows[i].hunt.id;
											break;
										}
									}
								ajax("user=" + usernameText.value + "&pwd=" + passwordText.value +"&who=" + who + "&parent=" + parent ,
									GLOBALS.PHP_FOLDER_LOCATION + "login.php",
										function(serverResponse){
											if(serverResponse=="true") window.location.reload();
											// TODO:  What  do we do if the user doesn't enter correct login information?
											else  console.log(serverResponse);
									});};
	// Append the children.
	document.getElementById("loginArea").appendChild(usernameLabel);
	document.getElementById("loginArea").appendChild(usernameText);
	document.getElementById("loginArea").appendChild(passwordLabel);
	document.getElementById("loginArea").appendChild(passwordText);
	document.getElementById("loginArea").appendChild(button);
	*/
}



// This function goes through all of the hunts and makes sure that all of them are no longer selected
// This means that no placemarks will still be displayed on the map, all table rows will return to default class
// and that the rectangles will go back to their default color.
// Is called every time a row is clicked on.
// Parameters: rectangles is the list of rectangles displayed on the map.
// selectedHunt is the this value from the row.onclick
function deselectAllHunts(rectangles,selectedHunt){
	table=document.getElementById("huntTable");
	// Loop through every row on the table.
	for(var i=0; i<table.rows.length; i++){
	// Unhighlight any highlighted rows (except the currently selected row).
		if(table.rows[i].className=="highlight" && table.rows[i]!=selectedHunt)
			table.rows[i].className="";
	}
	// Loop through every rectangle.
	for(var i=0; i<rectangles.length; i++){
		// Disable the login button.
		document.getElementById("studentLogin").disabled=true;
		// Return rectangle to default colors.
		if(rectangles[i].fillColor=="#FFFF00" && i!=selectedHunt.rectNumber){ 
			var rectOptions = {
			strokeColor : "#B7DDF2",
			fillColor : "#B7DDF2"
			};
		rectangles[i].setOptions(rectOptions);
		// Remove placemarks from map.
		if(rectangles.placemarks!=undefined){
			for(var j=0; j<rectangles.placemarks.length; j++){
				rectangles.placemarks[j].setMap(null);
			}
		}
		// Remove student/teacher login textareas (if they are showing).
		document.getElementById("loginArea").innerHTML="";
		}
	}
}

// This function reads the string from the searchArea, and then searches through all hunt titles for any hunts containing that phrase.
// Currently, we are going to do a simple .contains to search through all of the hunts.  Maybe in the future we'll want a more complicated
// search?
// Currently has four parameters passed, searchArea is the HTML node that contains the phrase the user is searching for.
// hunts is the variable containing the list of all of the hunts.
// map is just the google map object.
// rectangles is an array that currently contains all of the rectangles being displayed on the map.
function searchHunts(searchArea, hunts, map, rectangles){
	var table=document.getElementById("huntTable");
	// Deletes all rows except the header row from the table.
	while(table.rows.length>1) table.deleteRow(1);
	// Pass deselectAllHunts -1 as the selectedHunt because there can be no hunt in the -1 index, therefore no hunt is selected.
	deselectAllHunts(rectangles, -1);
	var searchPhrase=searchArea.value;
	var containedHunts=new Array();
	// Loop through all of the hunts and check if any of them contain the phrase in their title.
	for(var i=0; i<hunts.length; i++){
		// indexOf returns -1 if it doesn't contain it (== false) returns the starting index (>0 ==true) if it contains that string.
		// Currently the only normalization of strings that occurs is lowercasing.  Further normalization we might chose to do includes removing punctuation.
		if(hunts[i].title.toLowerCase().indexOf(searchPhrase.toLowerCase())+1) addHuntToViewTable(map, hunts[i], table, rectangles, i);
	}
}