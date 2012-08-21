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

// This function fills an html div with the contents of the map latlng control
// TODO: set more id's/classes here and move styling to stylesheets
//		 Also need to eventually move marker out of the code.
function createGotoControl(map, center, onSubmit, toPlot, isRectangle)
{
	var ctrlDiv = document.createElement('div');
	var latDMS = toDMS("lat", center.lat());
	var lngDMS = toDMS("long", center.lng());
	
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
	welcomeMsgDiv.innerHTML = NEW_ACTIVITY_MAP_INSTRUCTIONS;

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
	if(isRectangle){
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
		ctrlHeightInput.id = "longitudeIn";
		ctrlHeightInput.name = "longitudeIn";

		var upperBounds=rectangle.getBounds().getNorthEast();
		var lowerBounds=rectangle.getBounds().getSouthWest();
		ctrlWidthInput.value=upperBounds.lng()-lowerBounds.lng();
		ctrlHeightInput.value=upperBounds.lat()-lowerBounds.lat();
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
	if(isRectangle){
		layoutLatLongBox.appendChild(document.createElement("br"));
		layoutLatLongBox.appendChild(ctrlWidthLabel);
		layoutLatLongBox.appendChild(ctrlWidthInput);
		layoutLatLongBox.appendChild(document.createElement("br"));
		layoutLatLongBox.appendChild(ctrlHeightLabel);
		layoutLatLongBox.appendChild(ctrlHeightInput);
	}
	
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

	var ctrlBtn = document.createElement('a');
	ctrlBtn.innerHTML = "Take me there!";
	ctrlBtn.style.borderStyle = 'dotted';
	ctrlBtn.style.borderWidth = '1px';
	ctrlBtn.style.padding = '1px';

	var layoutBtnDiv = document.createElement('div');
	layoutBtnDiv.appendChild(ctrlBtn);
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
		if(!isRectangle){
			placeMarker(toPlot, new google.maps.LatLng(latValue, longValue));
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

			updateLatLng(new google.maps.LatLng(latDec, lngDec));
		}
	});
	// Index is the order in which controls are rendered, all before default controls
	ctrlDiv.index = 1;
	// display the control
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
}

function updateLatLng(location) {
	document.getElementById('latitudeIn').value = location.lat().toFixed(5);
	document.getElementById('longitudeIn').value = location.lng().toFixed(5);
}
