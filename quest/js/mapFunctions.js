// This file is going to be respsonsible for holding all of the map functions that are used multiple places.

// Initializes the map for the creation of the Activity Map.
function initializeMap(lat, lng){
	$('activity').innerHTML="";
		var myOptions = {
		center :new google.maps.LatLng(lat,lng),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	div=document.createElement("div");
	div.setAttribute("id", "map_canvas");
	document.getElementById("activity").appendChild(div);
	div.style.height="600px";
	div.style.width="100%";
	div.style.display = 'block';
	div.style.position = 'fixed';
	div.style.top = "0px";
	div.style.left = "0px";
	// odd name because I'm pretty sure at some point there is a global variable named map.
	var mapInstance = new google.maps.Map(div, myOptions);
	return mapInstance;
}

function removeMap(){
	$('map_canvas').style.display = 'none';
	$('contents').style.display = 'block';
}