// publicView.js
// Created by Jeffrey Rackauckas

//Dependencies:  mapFunctions.js & Google API v3.

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
				// If the rectangles map is null, it means the user has decided to hide the rectangle on the map.
				if(rectangles[i].map==null) row.className="hide";
				// Each row needs it's own rectNumber stored in itself, so that way each onclick function can have it's own rectNumber.
				row.rectNumber=i;
				// Store it for local memory so it's usable in the onclick function.
				var map=map;
				// The first time a row is clicked, it selects the hunt, and then unselects all other hunts.
				// If the row is clicked again, it'll mark the row as red, and stop displaying the hunt on the map.
				// If a row that is not being displayed on the map is clicked, it will return the hunt to normal.
				row.onclick=function(){
					if(this.className==""){
						for(var j=0; j<table.rows.length;j++){
							if(table.rows[j].className=="highlight") table.rows[j].className="";
						}
						this.className="highlight";
					} else if(this.className=="highlight"){
						this.className="hide";
						rectangles[this.rectNumber].setMap(null);
					} else if(this.className=="hide"){
						this.className="";
						rectangles[this.rectNumber].setMap(map);
					}
				};
		}
	}

}