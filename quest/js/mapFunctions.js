// This file is going to be respsonsible for holding all of the map functions that are used multiple places.

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

function initializeLatLng(onSubmit){
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
	google.maps.event.addDomListener(document.getElementById("submitButton"), 'click', onSubmit);
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
// TODO: Working on moving this to an HTML file, as all it does is create HTML.
function createGotoControl(map, center, onSubmit, toPlot, isRectangle)
{
	var ctrlDiv = document.createElement('div');
	var latDMS = toDMS("lat", center.lat());
	var lngDMS = toDMS("long", center.lng());
	// Right now, I've seperated out the new Hunt control box into an HTML file, and so when it's a rectangle we will just load the HTML
	// file and then plug in the values where needed.
	if(isRectangle){
		ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "newHuntControl.html", function(serverResponse){
			ctrlDiv.innerHTML=serverResponse;
			map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
			// Using setTimeout enables the browser to reset the DOM before executing the code to fill it in.
			// TODO:  Find a reliable way to handle this.
			setTimeout(function(){initializeLatLng(onSubmit);}, 750);
			});
		sessionStorage.lat=center.lat();
		sessionStorage.lng=center.lng();
		return;
	}


	
	ctrlDiv.id = "latlongctrl";
	ctrlDiv.style.width = '300px';
	ctrlDiv.style.backgroundColor = 'white';
	ctrlDiv.style.borderStyle = 'solid';
	ctrlDiv.style.borderWidth = '1px';
	ctrlDiv.style.padding = '15px';
	ctrlDiv.style.margin = '5px';
	ctrlDiv.style.textAlign = 'right';
	ctrlDiv.style.cursor = 'pointer';

	var welcomeMsgDiv = document.createElement('div');
	welcomeMsgDiv.id = "welcomeTxt";
	welcomeMsgDiv.name = "welcomeTxt";
	welcomeMsgDiv.style.textAlign = 'left';
	welcomeMsgDiv.innerHTML = (isRectangle)? GLOBALS.NEW_HUNT_MAP_INSTRUCTIONS : GLOBALS.NEW_ACTIVITY_MAP_INSTRUCTIONS;

	var ctrlLatInput = document.createElement('input');
	ctrlLatInput.id = "latitudeIn";
	ctrlLatInput.name = "latitudeIn";
	// 5 decimal places is accurate to about 1 meter
	ctrlLatInput.value = center.lat().toFixed(5);
	
	var ctrlLongInput = document.createElement('input');
	ctrlLongInput.id = "longitudeIn";
	ctrlLongInput.name = "longitudeIn";
	// 5 decimal places is accurate to about 1 meter
	ctrlLongInput.value = center.lng().toFixed(5);
	
	var ctrlLatLabel = document.createElement('label');
	ctrlLatLabel.innerHTML = "Latitude";
	ctrlLatLabel.className = "float_none";
	ctrlLatLabel.style.display = "inline";
	ctrlLatLabel.setAttribute("for", "latitudeIn");
	
	var ctrlLongLabel = document.createElement('label');
	ctrlLongLabel.innerHTML = "Longitude";
	ctrlLongLabel.className = "float_none";
	ctrlLongLabel.style.display = "inline";
	ctrlLongLabel.setAttribute("for", "longitudeIn");
	
	// For the rectangle object, we want the option for the user to directly change the width or height.
	var ctrlWidthLabel;
	var ctrlHeightLabel;
	var ctrlWidthInput;
	var ctrlHeightInput;
	var DMSWidthLabel;
	var DMSHeightLabel;
	var DMSWidthInput;
	var DMSHeightInput;
	if(isRectangle){
		// I wish I didn't have to create two different variables for this, 
	//	   but it's the only way to have it so that way it can show up under the two parents (that i know of)
		var decimal=createHeightWidthInputs();
		ctrlWidthLabel=decimal.ctrlWidthLabel;
		ctrlHeightLabel=decimal.ctrlHeightLabel;
		ctrlWidthInput=decimal.ctrlWidthInput;
		ctrlHeightInput=decimal.ctrlHeightInput;
		var DMS=createHeightWidthInputs();
		DMSWidthLabel=DMS.ctrlWidthLabel;
		DMSHeightLabel=DMS.ctrlHeightLabel;
		DMSWidthInput=DMS.ctrlWidthInput;
		// We want the DMS inputs to have different id's.
		DMSWidthInput.id="DMSWidth";
		DMSHeightInput=DMS.ctrlHeightInput;
		DMSHeightInput.id="DMSHeight";
	}

	var ctrlDecimalOrDMSSelect = document.createElement('select');
	ctrlDecimalOrDMSSelect.id = "decimalDMSSelect";
	ctrlDecimalOrDMSSelect.name = "decimalDMSSelect";
	ctrlDecimalOrDMSSelect.add(new Option("Decimal", "0"));
	ctrlDecimalOrDMSSelect.add(new Option("DMS", "1"));
	ctrlDecimalOrDMSSelect.style.cssfloat = "right";
	ctrlDecimalOrDMSSelect.selectedIndex = "1";


	var ctrlSelectDiv = document.createElement('div');
	ctrlSelectDiv.appendChild(ctrlDecimalOrDMSSelect);

	layoutLatLongBox = document.createElement('div');
	layoutLatLongBox.style.paddingBottom = '5px';
	layoutLatLongBox.style.paddingTop = '5px';
	layoutLatLongBox.style.display = "none";
	layoutLatLongBox.appendChild(document.createElement('br'));
	layoutLatLongBox.appendChild(ctrlLatLabel);
	layoutLatLongBox.appendChild(ctrlLatInput);
	layoutLatLongBox.appendChild(document.createElement('br'));
	layoutLatLongBox.appendChild(ctrlLongLabel);
	layoutLatLongBox.appendChild(ctrlLongInput);
	// If it's a rectangle, we want to add the width/height modifiers.
		/*   Deleting this section should be able to make the width and height boxes no longer visible to the user, without having to change
		all of the code that made the boxes work.  If it does work, I will go back and delete this section of code.
	if(isRectangle){
		layoutLatLongBox.appendChild(document.createElement("br"));
		layoutLatLongBox.appendChild(ctrlWidthLabel);
		layoutLatLongBox.appendChild(ctrlWidthInput);
		layoutLatLongBox.appendChild(document.createElement("br"));
		layoutLatLongBox.appendChild(ctrlHeightLabel);
		layoutLatLongBox.appendChild(ctrlHeightInput);
	} */
	
	var ctrlLatNS = document.createElement('select');
	ctrlLatNS.id = "latNSSelect";
	ctrlLatNS.name = "latNSSelect";
	ctrlLatNS.className = "short";
	ctrlLatNS.add(new Option("North", "0"));
	ctrlLatNS.add(new Option("South", "1"));
	if (latDMS.compass == "N") { ctrlLatNS.selectedIndex = 0; }
	else { ctrlLatNS.selectedIndex = 1; }
	
	var ctrlLatDegrees = document.createElement('input');
	ctrlLatDegrees.id = "latDegrees";
	ctrlLatDegrees.name = "latDegrees";
	ctrlLatDegrees.value = latDMS.degrees;
	ctrlLatDegrees.className = "float_none";
	ctrlLatDegrees.style.display = "inline";
	ctrlLatDegrees.style.width = "80px";
	
	var ctrlLatMinutes = document.createElement('input');
	ctrlLatMinutes.id = "latMinutes";
	ctrlLatMinutes.name = "latMinutes";
	ctrlLatMinutes.value = latDMS.minutes;
	ctrlLatMinutes.className = "float_none";
	ctrlLatMinutes.style.display = "inline";
	ctrlLatMinutes.style.width = "80px";
	
	var ctrlLongNS = document.createElement('select');
	ctrlLongNS.id = "longNSSelect";
	ctrlLongNS.name = "longNSSelect";
	ctrlLongNS.className = "short";
	ctrlLongNS.add(new Option("West", "0"));
	ctrlLongNS.add(new Option("East", "1"));
	if (lngDMS.compass == "W") { ctrlLongNS.selectedIndex = 0; }
	else { ctrlLongNS.selectedIndex = 1; }
	
	var ctrlLongDegrees = document.createElement('input');
	ctrlLongDegrees.id = "longDegrees";
	ctrlLongDegrees.name = "longDegrees";
	ctrlLongDegrees.value = lngDMS.degrees;
	ctrlLongDegrees.className = "float_none";
	ctrlLongDegrees.style.display = "inline";
	ctrlLongDegrees.style.width = "80px";
	
	var ctrlLongMinutes = document.createElement('input');
	ctrlLongMinutes.id = "longMinutes";
	ctrlLongMinutes.name = "longMinutes";
	ctrlLongMinutes.value = lngDMS.minutes;
	ctrlLongMinutes.className = "float_none";
	ctrlLongMinutes.style.display = "inline";
	ctrlLongMinutes.style.width = "80px";
	
	var layoutDMSBox = document.createElement('div');
	layoutDMSBox.style.paddingBottom = '5px';
	layoutDMSBox.style.paddingTop = '5px';
	layoutDMSBox.style.display = "block";
	layoutDMSBox.appendChild(document.createElement('br'));
	layoutDMSBox.appendChild(ctrlLatNS);
	layoutDMSBox.appendChild(ctrlLatDegrees);
	layoutDMSBox.appendChild(ctrlLatMinutes);
	layoutDMSBox.appendChild(document.createElement('br'));
	layoutDMSBox.appendChild(ctrlLongNS);
	layoutDMSBox.appendChild(ctrlLongDegrees);
	layoutDMSBox.appendChild(ctrlLongMinutes);
	/*   Deleting this section should be able to make the width and height boxes no longer visible to the user, without having to change
		all of the code that made the boxes work.  If it does work, I will go back and delete this section of code.
	if(isRectangle){ 
		layoutDMSBox.appendChild(document.createElement("br"));
		layoutDMSBox.appendChild(DMSWidthLabel);
		layoutDMSBox.appendChild(DMSWidthInput);
		layoutDMSBox.appendChild(document.createElement("br"));
		layoutDMSBox.appendChild(DMSHeightLabel);
		layoutDMSBox.appendChild(DMSHeightInput);
	} */


	var ctrlBtn = document.createElement('a');
	ctrlBtn.innerHTML = "Take me there!";
	ctrlBtn.style.borderStyle = 'dotted';
	ctrlBtn.style.borderWidth = '1px';
	ctrlBtn.style.padding = '1px';

	var layoutBtnDiv = document.createElement('div');
	if(!isRectangle) layoutBtnDiv.appendChild(ctrlBtn);
	layoutBtnDiv.style.textAlign = 'right';

	var ctrlSubmitBtn = document.createElement('a');
	ctrlSubmitBtn.innerHTML = "Submit!";
	ctrlSubmitBtn.style.backgroundColor = 'green';
	ctrlSubmitBtn.style.borderStyle = 'dotted';
	ctrlSubmitBtn.style.borderWidth = '1px';
	ctrlSubmitBtn.style.padding = '1px';

	var layoutSubmitBtnDiv = document.createElement('div');
	layoutSubmitBtnDiv.appendChild(ctrlSubmitBtn);
	layoutSubmitBtnDiv.style.textAlign = 'center';

	// Assemble the custom control
	ctrlDiv.appendChild(welcomeMsgDiv);
	ctrlDiv.appendChild(ctrlSelectDiv);
	ctrlDiv.appendChild(document.createElement('br'));
	ctrlDiv.appendChild(layoutDMSBox);
	ctrlDiv.appendChild(layoutLatLongBox);
	ctrlDiv.appendChild(layoutBtnDiv);
	ctrlDiv.appendChild(document.createElement('br'));
	ctrlDiv.appendChild(document.createElement('hr'));
	ctrlDiv.appendChild(layoutSubmitBtnDiv);

	google.maps.event.addDomListener(ctrlBtn, 'click', function(event) {
		if(!isRectangle){
			var latValue;
			var longValue;
			
			if (ctrlDecimalOrDMSSelect.selectedIndex == "0")
			{
				latValue = ctrlLatInput.value;
				longValue = ctrlLongInput.value;
			}
			else if (ctrlDecimalOrDMSSelect.selectedIndex == "1")
			{
				var latDirection;
				var longDirection;

				if (ctrlLatNS.selectedIndex == 0) { latDirection = "N"; }
				else { latDirection = "S"; }
				if (ctrlLongNS.selectedIndex == 0) { longDirection = "W"; }
				else { longDirection = "E"; }
				
				latValue = toDecimal(latDirection, ctrlLatDegrees.value, ctrlLatMinutes.value);
				longValue = toDecimal(longDirection, ctrlLongDegrees.value, ctrlLongMinutes.value);
			}
			placeMarker(toPlot, new google.maps.LatLng(latValue, longValue));
		} else{
				updateRectangle(toPlot);
			}
		});

	google.maps.event.addDomListener(ctrlSubmitBtn, 'click', onSubmit);

	google.maps.event.addDomListener(ctrlDecimalOrDMSSelect, 'change', function (event) {
		var latValue = ctrlLatInput.value;
		var longValue = ctrlLongInput.value;
		
		if (ctrlDecimalOrDMSSelect.selectedIndex == "1")
		{
			layoutDMSBox.style.display = "block";
			layoutLatLongBox.style.display = "none";

			updateLatLngDMS(new google.maps.LatLng(latValue, longValue));
		}
		else
		{
			layoutDMSBox.style.display = "none";
			layoutLatLongBox.style.display = "block";
			
			var latDirection;
			var longDirection;

			if (ctrlLatNS.selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (ctrlLongNS.selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
			
			var latDec = toDecimal(latDirection, ctrlLatDegrees.value, ctrlLatMinutes.value);
			var lngDec = toDecimal(longDirection, ctrlLongDegrees.value, ctrlLongMinutes.value);
			// If width and height DMS values exist, set width and height to them.  otherwise set them to null.
			updateLatLngBox(new google.maps.LatLng(latDec, lngDec), isRectangle);
		}
	});
	// Index is the order in which controls are rendered, all before default controls
	ctrlDiv.index = 1;
	// display the control
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
}

function createHeightWidthInputs(){
	ctrlWidthLabel=document.createElement("label");
	ctrlWidthLabel.innerHTML="Width";
	ctrlWidthLabel.className="float_none";
	ctrlWidthLabel.style.display="inline";
	ctrlWidthLabel.setAttribute("for", "widthIn");
	
	ctrlHeightLabel=document.createElement("label");
	ctrlHeightLabel.innerHTML="height";
	ctrlHeightLabel.className="float_none";
	ctrlHeightLabel.style.display="inline";
	ctrlHeightLabel.setAttribute("for", "heightIn");
	
	ctrlWidthInput = document.createElement('input');
	ctrlWidthInput.id = "widthIn";
	ctrlWidthInput.name = "widthIn";
	
	ctrlHeightInput = document.createElement('input');
	ctrlHeightInput.id = "heightIn";
	ctrlHeightInput.name = "heightIn";

	var upperBounds=rectangle.getBounds().getNorthEast();
	var lowerBounds=rectangle.getBounds().getSouthWest();
	ctrlWidthInput.value=upperBounds.lng()-lowerBounds.lng();
	ctrlHeightInput.value=upperBounds.lat()-lowerBounds.lat();
	return {
		ctrlWidthLabel:ctrlWidthLabel,
		ctrlHeightLabel: ctrlHeightLabel,
		ctrlWidthInput: ctrlWidthInput,
		ctrlHeightInput: ctrlHeightInput
	};
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
							parseFloat(document.getElementById("latitudeIn").value)-parseFloat(document.getElementById("heightIn").value)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)-parseFloat(document.getElementById("widthIn").value)/2.0);
		northeastBounds=new google.maps.LatLng(
							parseFloat(document.getElementById("latitudeIn").value)+parseFloat(document.getElementById("heightIn").value)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)+parseFloat(document.getElementById("widthIn").value)/2.0);
	} else{
		var direction=(document.getElementById("latNSSelect").value==0) ? "N" : "S";
		var lat=toDecimal(direction, document.getElementById("latDegrees").value,
									document.getElementById("latMinutes").value);
		direction=(document.getElementById("longNSSelect").value==0) ? "W" : "E";
		var lng=toDecimal(direction, document.getElementById("longDegrees").value,
									document.getElementById("longMinutes").value);
		southwestBounds=new google.maps.LatLng(lat-document.getElementById("DMSHeight").value/2,
												lng-document.getElementById("DMSWidth").value/2);
		northeastBounds=new google.maps.LatLng(lat+document.getElementById("DMSHeight").value/2,
												lng+document.getElementById("DMSWidth").value/2);
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