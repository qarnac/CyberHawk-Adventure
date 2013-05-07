// This file is going to be respsonsible for holding all of the map functions that are used multiple places.



function $(x){return document.getElementById(x);}

// Initializes the map for the creation of the Activity Map.
function initializeMap(lat, lng){
	$('activity').innerHTML="";
		var myOptions = {
		center :new google.maps.LatLng(lat,lng),
		zoom : 14,
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

// This function is called from createHunt.html
// The purpose of this function is to display the hunt bounds on the right side of the form.
function displayHuntBounds(){
	var bounds=JSON.parse(sessionStorage.toPlot);
	// Convert the bounds to a google maps LatLngBounds object.
	bounds=new google.maps.LatLngBounds(new google.maps.LatLng(bounds.minLat, bounds.minLng), new google.maps.LatLng(bounds.maxLat, bounds.maxLng));
	// Initialize the options for the google maps.
	var myOptions = {
		center :new google.maps.LatLng(bounds.getCenter().lat(),bounds.getCenter().lng()),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	var map=new google.maps.Map(document.getElementById("map"), myOptions);
	var rectangle=createRectangleOverlay(map, bounds);
	rectangle.setDraggable(false);
}

function removeMap(){
	$('map_canvas').style.display = 'none';
	$('contents').style.display = 'block';
}

// Creates a Rectangle overlay on the passed map object, and then returns the rectangle overlay.
function createRectangleOverlay(map, bounds){
	var rectangleOverlay = new google.maps.Rectangle();
	var rectOptions = {
		strokeColor : "#B7DDF2",
		strokeOpacity : 0.7,
		strokeWeight : 2,
		fillColor : "#B7DDF2",
		fillOpacity : 0.25,
		map : map,
		bounds : bounds
	};
	rectangleOverlay.setOptions(rectOptions);
	return rectangleOverlay;
}


// Is called when the user searches an address on the map.  Changes the coordinates to the coordinates of the address.
function searchAddress(){
	var address=document.getElementById("searchBar").value.replace(" ", "+");
	ajax("GET", "http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true", function(event){
		address=JSON.parse(event);
		console.log(address);

	// TODO:  Catch the error thrown if the string can not be parsed into a float.
	var southwestBounds=new google.maps.LatLng(
							address.results[0].geometry.location.lat-(GLOBALS.DEFAULT_RECT_SIZE/2.0),
							address.results[0].geometry.location.lng-(GLOBALS.DEFAULT_RECT_SIZE/2.0));
	var northeastBounds=new google.maps.LatLng(
							address.results[0].geometry.location.lat+(GLOBALS.DEFAULT_RECT_SIZE/2.0),
							address.results[0].geometry.location.lng+(GLOBALS.DEFAULT_RECT_SIZE/2.0));
	var bounds=new google.maps.LatLngBounds(southwestBounds, northeastBounds);
	var rectOptions = {
		bounds : bounds
	};
	rectangle.setOptions(rectOptions);
	rectangle.getMap().panTo(rectangle.getBounds().getCenter());
	});
}

// Is called by the submit button in the gotoControlBox submit for a new hunt.
function submitNewHunt(){
	var toPlot=JSON.parse(sessionStorage.toPlot);
	var additionalQuestions=new Object();
	additionalQuestions["questiona"]=document.getElementById("additionalQuestion1").value;
	additionalQuestions["questionb"]=document.getElementById("additionalQuestion2").value;
	additionalQuestions["questionc"]=document.getElementById("additionalQuestion3").value;
	var date=(Date.parse(document.getElementById("dateOfTrip").value)/1000)+86400
	ajax("title=" + document.getElementById("title").value +
		"&username=" + document.getElementById("huntUsername").value +
		"&password=" + document.getElementById("password").value +
		"&maxLat=" + toPlot.maxLat +
		"&minLat=" + toPlot.minLat +
		"&minLng=" + toPlot.minLng +
		"&maxLng=" + toPlot.maxLng +
		"&additionalQuestions=" + JSON.stringify(additionalQuestions) +
		"&dateOfTrip=" + date
		, GLOBALS.PHP_FOLDER_LOCATION + "createHunt.php", function(serverResponse){
			if(serverResponse=="success") window.location.reload();
			else console.log(serverResponse);
		});
	return false;
}

function takeMeThereActivity(toPlot){
	var latValue;
	var longValue;
	
	if (document.getElementById("decimalDMSSelect").selectedIndex == "0")
	{
		latValue = document.getElementById("latitudeIn").value;
		longValue = document.getElementById("longitudeIn").value;
	}
	else{
		var latDirection;
		var longDirection;
		if (document.getElementById("latNSSelect").selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (document.getElementById("longNSSelect").selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
				
			latValue = toDecimal(latDirection, document.getElementById("latDegrees").value, document.getElementById("latMinutes").value);
			longValue = toDecimal(longDirection, document.getElementById("longDegrees").value, document.getElementById("longMinutes").value);
		}
	placeMarker(toPlot, new google.maps.LatLng(latValue, longValue));	
}
// This is the function that is called when the users clicks the edit lat/lng button on the createHunt.html form.
// The goal of this function is to store all entered values into the sessionStorage and then create the map view.
function editHuntLatLng(){
	var form=document.getElementById("createHuntForm");
	var answers=new Object();
	for(var i = 0; i < form.length; i++) {
			answers[form[i].id] = form[i].value;
	}
	sessionStorage.huntInformation=JSON.stringify(answers);
	createhunt();
}
// This is the new function that is called from clicking the submit button in the new hunt control.
// The goal of this function is to remove the map display, and show the new hunt form.
// The variable toPlot is the hunt boundaries.  Store that into sessionStorage.
function displayNewHuntForm(toPlot){
	// Store toPlot into the sessionStorage.
	var bounds=new Object();
	bounds.maxLat=toPlot.getBounds().getNorthEast().lat();
	bounds.minLat=toPlot.getBounds().getSouthWest().lat();
	bounds.minLng=toPlot.getBounds().getSouthWest().lng();
	bounds.maxLng=toPlot.getBounds().getNorthEast().lng();
	sessionStorage.toPlot=JSON.stringify(bounds);
	// The display is going to be needed a lot, so store it in a variable for faster runtime.
	var display=document.getElementById("activity");
	display.innerHTML=GLOBALS.createHunt;
	// Force a DOM refresh.
	display.style.display="none";
	display.style.display="block";
	// If the user has previously entered information about the hunt, plug it in.
	if(sessionStorage.huntInformation!=""){
		var hunt=JSON.parse(sessionStorage.huntInformation);
		for(element in hunt){
			document.getElementById(element).value=hunt[element];
		}
	}
	displayHuntBounds();
}	

// Is called by createGotoControl in order to fill in the goToControlbox and set up events.
function initializeLatLng(toPlot, isRectangle){
	var latDMS = toDMS("lat", sessionStorage.lat);
	var lngDMS = toDMS("long", sessionStorage.lng);
	document.getElementById("decimalDMSSelect").value=1;
	document.getElementById("latNSSelect").value=(latDMS.compass=="N")? 0:1;
	document.getElementById("latDegrees").value=latDMS.degrees;
	document.getElementById("latMinutes").value=latDMS.minutes;
	document.getElementById("longNSSelect").value=(lngDMS.compass=="W")?0:1;
	document.getElementById("longDegrees").value=lngDMS.degrees;
	document.getElementById("longMinutes").value=lngDMS.minutes;
	google.maps.event.addDomListener(document.getElementById("decimalDMSSelect"), 'change', changeSelectedLatLngDisplay);
	if(isRectangle){
		google.maps.event.addDomListener(document.getElementById("submitButton"), 'click', function(event){ displayNewHuntForm(toPlot); });
		google.maps.event.addDomListener(document.getElementById("takeMeThere"), 'click', function(event) { updateRectangle(toPlot);});
	} else{
		google.maps.event.addDomListener(document.getElementById("submitButton"), 'click', function(event){ GoToControlOnSubmit(); });
		google.maps.event.addDomListener(document.getElementById("takeMeThere"), 'click', function(event) { takeMeThereActivity(toPlot);});
	}
}

// Is called when the select for Decimal or DMS is changed in the control box.
function changeSelectedLatLngDisplay(){
	var latValue = document.getElementById("latitudeIn").value;
	var longValue = document.getElementById("longitudeIn").value;
		
		if (document.getElementById("decimalDMSSelect").selectedIndex == "1")
		{
			document.getElementById("DMSLatLng").style.display = "block";
			document.getElementById("decimalLatLng").style.display = "none";

			updateLatLngDMS(new google.maps.LatLng(latValue, longValue));
		}
		else
		{
			document.getElementById("DMSLatLng").style.display = "none";
			document.getElementById("decimalLatLng").style.display = "block";
			
			var latDirection;
			var longDirection;

			if (document.getElementById("latNSSelect").selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (document.getElementById("longNSSelect").selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
			
			var latDec = toDecimal(latDirection, document.getElementById("latDegrees").value, document.getElementById("latMinutes").value);
			var lngDec = toDecimal(longDirection, document.getElementById("longDegrees").value, document.getElementById("longMinutes").value);
			// If width and height DMS values exist, set width and height to them.  otherwise set them to null.
			updateLatLngBox(new google.maps.LatLng(latDec, lngDec), true);
		}
	
}

// This function fills an html div with the contents of the map latlng control
function createGotoControl(map, center, onSubmit, toPlot, isRectangle)
{
	var ctrlDiv = document.createElement('div');
	var latDMS = toDMS("lat", center.lat());
	var lngDMS = toDMS("long", center.lng());
	// Right now, I've seperated out the new Hunt control box into an HTML file, and so when it's a rectangle we will just load the HTML
	// file and then plug in the values where needed.
	if(isRectangle){
		ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "newHuntControl.html", function(serverResponse){
			document.body.appendChild(ctrlDiv);
			ctrlDiv.innerHTML=serverResponse;
			map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
			// Changing the display to none/block is a reliable way to refresh the DOM.
			ctrlDiv.style.display="none";
			ctrlDiv.style.display="block";
			initializeLatLng(toPlot, isRectangle);
			document.body.removeChild(ctrlDiv);
			});
		sessionStorage.lat=center.lat();
		sessionStorage.lng=center.lng();
		return;
	} else{
		ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "newActivityControl.html", function(serverResponse){
			ctrlDiv.innerHTML=serverResponse;
			map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
			sessionStorage.lat=center.lat();
			sessionStorage.lng=center.lng();
			setTimeout(function(){initializeLatLng(toPlot, isRectangle);}, 750);
		});
	
	}


}
// Updates the GoToControlBox from decimal to DMS.
function updateLatLngDMS(location, isRectangle) {
	latDMS = toDMS("lat", location.lat());
	longDMS = toDMS("long", location.lng());
	
	if (latDMS.compass == "N") { document.getElementById('latNSSelect').selectedIndex = 0; }
	else { document.getElementById('latNSSelect').selectedIndex = 1; }
	if (longDMS.compass == "W") { document.getElementById('longNSSelect').selectedIndex = 0; }
	else { document.getElementById('longNSSelect').selectedIndex = 1; }

	document.getElementById('latDegrees').value = latDMS.degrees;
	document.getElementById('latMinutes').value = latDMS.minutes;
	
	document.getElementById('longDegrees').value = longDMS.degrees;
	document.getElementById('longMinutes').value = longDMS.minutes;
	if(isRectangle){
		document.getElementById("DMSWidth").value=document.getElementById("widthIn").value;
		document.getElementById("DMSHeight").value=document.getElementById("heightIn").value;
	}
}

// Updates the GoToControlBox when going to Decimals.
function updateLatLngBox(location, isRectangle) {
	document.getElementById('latitudeIn').value = location.lat().toFixed(5);
	document.getElementById('longitudeIn').value = location.lng().toFixed(5);
}

// Is called when the bounds of the rectangle are changed.
// Updates the latLng box to show the new width, height, lat, and lng.
function updateWidthHeight(bounds){
	// Sets up the width and height for both of the boxes.
	//var width=bounds.getNorthEast().lat()-bounds.getSouthWest().lat();
	//var height=bounds.getNorthEast().lng()-bounds.getSouthWest().lng();
	//document.getElementById("widthIn").value=width;
	//document.getElementById("DMSWidth").value=width;
	//document.getElementById("heightIn").value=height;
	//document.getElementById("DMSHeight").value=height;
	// Set up the lat/lng for the decimal box.
	document.getElementById("latitudeIn").value=bounds.getCenter().lat();
	document.getElementById("longitudeIn").value=bounds.getCenter().lng();
	// This fancy code is needed to set up the lat/lng for the DMS boxes.
	var lat=toDMS("lat", bounds.getCenter().lat());
	var lng=toDMS("long", bounds.getCenter().lng());
	document.getElementById("latNSSelect").value=(lat.compass=="N")? 0:1;
	document.getElementById("latDegrees").value=lat.degrees;
	document.getElementById("latMinutes").value=lat.minutes;
	document.getElementById("longNSSelect").value=(lng.compass=="E")? 1:0;
	document.getElementById("longDegrees").value=lng.degrees;
	document.getElementById("longMinutes").value=lng.minutes;
}
	
// Converts the coordinates to DMS.
function toDMS(direction, deg) {
	var compass;
	if ((direction == "lat") && (deg < 0)) {
		compass = "S";
	}
	else if ((direction == "lat") && (deg > 0)) {
		compass = "N";
	}
	else if ((direction == "long") && (deg < 0)) {
		compass = "W";
	}
	else if ((direction == "long") && (deg > 0)) {
		compass = "E";
	}
	
	var degrees;

	if (deg < 0) {
		deg = deg * -1;
	}
	degrees = Math.floor(deg);
	degrees = degrees.toFixed();
	
	var minutes_seconds = (deg % 1) * 60;
	var minutes = Math.floor(minutes_seconds);
	minutes = minutes.toFixed();
	var seconds = Math.round((minutes_seconds % 1) * 100);
	seconds = seconds.toFixed();
	
	return {
		'compass': compass,
		'degrees': degrees,
		'minutes': minutes + "." + seconds
	};
}

// This is the function that is called by the take me there! button.
// It's purpose is to change the rectangle to fit the typed in criteria.
function updateRectangle(rectangle){
	var northeastBounds;
	var southwestBounds;
	// Make sure that we read the currently showing lat/lng.
	if(document.getElementById("decimalDMSSelect").value==0){
	// TODO:  Catch the error thrown if the string can not be parsed into a float.
		southwestBounds=new google.maps.LatLng(
							parseFloat(document.getElementById("latitudeIn").value)-parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)-parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0);
		northeastBounds=new google.maps.LatLng(
							parseFloat(document.getElementById("latitudeIn").value)+parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)+parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0);
	} else{
		var direction=(document.getElementById("latNSSelect").value==0) ? "N" : "S";
		var lat=toDecimal(direction, document.getElementById("latDegrees").value,
									document.getElementById("latMinutes").value);
		direction=(document.getElementById("longNSSelect").value==0) ? "W" : "E";
		var lng=toDecimal(direction, document.getElementById("longDegrees").value,
									document.getElementById("longMinutes").value);
		southwestBounds=new google.maps.LatLng(lat-GLOBALS.DEFAULT_RECT_SIZE/2,
												lng-GLOBALS.DEFAULT_RECT_SIZE/2);
		northeastBounds=new google.maps.LatLng(lat+GLOBALS.DEFAULT_RECT_SIZE/2,
												lng+GLOBALS.DEFAULT_RECT_SIZE/2);
	}
		bounds=new google.maps.LatLngBounds(southwestBounds, northeastBounds);
	var rectOptions = {
		bounds : bounds
	};
	rectangle.setOptions(rectOptions);
	rectangle.getMap().panTo(rectangle.getBounds().getCenter());
}

// Converts DMS Coordinates to decimal.
function toDecimal(direction, deg, minutes) {
	minutes = parseFloat(minutes);
	deg = parseFloat(deg);
	var seconds = (Math.floor(minutes) * 60) + ((minutes % 1) *60);
	
	var degrees = deg + (seconds / 3600);
	if ((direction == "W") || (direction == "S")) {
		degrees = degrees * -1;
	}

	return degrees;
}