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
				//If the hunt bound is within the visible map bounds, then add it to the table.
				// For some reason, -1 is the parameter you pass to indicate you want the row inserted at the end.
				var row=table.insertRow(-1);
				row.insertCell(-1).innerHTML=hunts[i].title;
				// Currently, we have no way of accessing the teachers name via the hunt.  It's starting to seem like we may want to change some structuring in the database, so I'm going to wait to add this.
				row.insertCell(-1).innerHTML="TODO: Add teacher name"
				// This is the rectangle the user currently has selected.
				if(rectangles[i].fillColor=="#FFFF00") row.className="highlight";
				// Each row needs it's own rectNumber stored in itself, so that way each onclick function can have it's own rectNumber.
				row.rectNumber=i;
				row.hunt=hunts[i];
				// Store things in local memory so it's usable in the onclick function.
				var map=map;
				// The first time a row is clicked, it selects the hunt, and then unselects all other hunts.
				// If the row is clicked again, it'll zoom into that hunt, and display the activities for that hunt.
				row.onclick=function(){
					// Loop through rectangles and unhighlight all the rectangles.
					for(var j=0; j<rectangles.length;j++){
						if(rectangles[j].fillColor=="#FFFF00" && j!=this.rectNumber){ 
						var rectOptions = {
							strokeColor : "#B7DDF2",
							fillColor : "#B7DDF2"
							};
						rectangles[j].setOptions(rectOptions);
						}
					}
					for(var j=0; j<table.rows.length; j++){
						if(table.rows[j].className=="highlight" && table.rows[j]!=this)
							table.rows[j].className="";
					}
					
					if(this.className==""){
						// Change the color of the table row, and the hunt display on the map.
						this.className="highlight";
						var rectOptions = {
							strokeColor : "#FFFF00",
							fillColor : "#FFFF00"
						};
						rectangles[this.rectNumber].setOptions(rectOptions);
					} else if(this.className=="highlight"){
						map.panTo(rectangles[this.rectNumber].getBounds().getCenter());
						// Get all of the activities that correspond that hunt.
						ajax("huntid="+this.hunt.id, GLOBALS.PHP_FOLDER_LOCATION + "getAllActivitiesFromHunt.php", function(serverResponse){
							// Loop through all of the hunts and plot only the hunts with a status of completed.
							activities=JSON.parse(serverResponse);
							for(var i=0; i<activities.length; i++){
								// TODO:  We need to create a new table display for the public view.
								// TODO: Get rid of displaying the unverified activities.
								if(activities[i].status=="Verified" || activities[i].status=="unverified"){
									createPlacemark(activities[i], map, 2);
								}
							}
						});
					}
				};
		}
	}

}