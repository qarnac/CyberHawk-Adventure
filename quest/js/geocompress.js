/**
 * @author sabareesh kkanan subramani
 * Contributions by BillSanders
 * Instantiates the object morc from drag and drop
 * compresses the image
 * finds geo location of image
 * If geo location is not found displays map which allows user to select a location from it.
 */

// geocompress is the main point of entry into this file.
// As of Aug 8, 2012, only called from dragdrop.js
// creates the media object that has compressed image data url and geo co-ordinates
// This is eventually POST'd in upload.php
function geocompress(file, type) {
	this.file = compress(file, type);
	this.loc = gpsverify(file);  // If gps coords not embedded, will start google map
	this.verify = function() {
		if (this.file.dataurl && this.loc.lat && this.loc.lng) {
			this.file.dataurl = this.file.dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
			return true;
		}
		else {
			return false;
		}
	}
}

// TODO: What type of object is 'x'?  What type of object is morc?
// Note: morc is first instantiated and described in dragdrop.js as:
//// var morc; // image object with compressed image with geo location
// Compresses the image by first by resizing the image to smaller size
// and converting the resized image to jpeg dta url with quality of 0.8
function compress(file, type) {
	var x = new Object();
	var img = new Image();
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function(e) {
		img.src = e.target.result;
		img.onload = function() {

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var MAX_WIDTH = 450;
			var MAX_HEIGHT = 280;
			var width = img.width;
			var height = img.height;

			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			}
			else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);
			x.dataurl = canvas.toDataURL("image/jpeg", 0.8);
			//dataurl=dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		}
	}
	return x;
}

// TODO: do we really need this?  Is there a good reason not to use google.maps.LatLng()?
//constructor for latlng object
function latlng(lat, lng) {
	this.lat = parseFloat(lat);
	this.lng = parseFloat(lng);
}

//constructor for a rectangle object
function georect(dim1, dim2) {
	this.topleft = dim1;
	this.bottomright = dim2;
}

// uses a latlng object
// this function can be replaced with calls to google.maps.LatLngBounds.contains(LatLng)
//checks whether a latlng point is inside a rectangle
// Only called within this file
function checkloc(rect, loc) {
	return rect.topleft.lat < loc.lat && rect.bottomright.lat > loc.lat && rect.topleft.lng < loc.lng && rect.bottomright.lng > loc.lng;
}

// If gps coords not embedded, will start google map UI for manual user GPS entry
function gpsverify(file) {
	var loc = new Object();
	var binary_reader = new FileReader();
	binary_reader.readAsBinaryString(file);

	binary_reader.onloadend = function(e) {
		var jpeg = new JpegMeta.JpegFile(e.target.result, file.name);
		if (jpeg.gps && jpeg.gps.longitude) {
			var x = new latlng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
			if (checkloc(huntboundary, x)) {
//			var gps_loc = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
//			if (huntboundary.contains(gps_loc)) { //  <- currently doing nothing.
				loc.latlng = new latlng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
				loc.from = "Native";
			}
			else {
				alert("not inside the boundary");
			}
		}
		else {
			alert("The image you've selected is not geo tagged.\nPlease click on the location where you have taken the picture.\nOnce you have selected the right spot, please click 'Submit'");
			displayMap(true);
			instantiateGoogleMap();
		}
	}
	return loc;
}

// This function builds the map interface with the proper locations, bounds, etc.
function instantiateGoogleMap() {
	var x = new Object();

	//boundary
	var southWestBound = new google.maps.LatLng(huntboundary.topleft.lat, huntboundary.topleft.lng);
	var northEastBound = new google.maps.LatLng(huntboundary.bottomright.lat, huntboundary.bottomright.lng);
	var bounds = new google.maps.LatLngBounds(southWestBound, northEastBound);

	var mapOptions = {
		center : bounds.getCenter(),
		zoom : 13,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
	var map = new google.maps.Map($("map_canvas"), mapOptions);

	map.fitBounds(bounds);
	map.setZoom(map.getZoom() + 2);

	// This is the rectangular overlay that goes on top of the map to display the bounds
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
	
	var myMarker = new google.maps.Marker(
	{
		position: bounds.getCenter(),
		draggable: true,
		map: map
	});

	var gotoControlDiv = document.createElement('div');
	var gotoControl = createGotoControl(gotoControlDiv, map, myMarker, bounds.getCenter());
	
	// Index is the order in which controls are rendered, all before default controls
	gotoControlDiv.index = 1;
	// display the control
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(gotoControlDiv);

	google.maps.event.addListener(map, 'click', function(e) {
		alert("You can only select a location within the hunt area.\n")
	});

	google.maps.event.addListener(myMarker, 'drag', function(event) {
		if (document.getElementById('decimalDMSSelect').selectedIndex == 0) {
			updateLatLng(event.latLng);
		}
		else {
			updateLatLngDMS(event.latLng);
		}
//		updateLatLngFollow(myFollowMarker, dropPrecision(event.latLng, bounds));
	});
	
	// TODO could do bounds checking here?
	google.maps.event.addListener(myMarker, 'dragend', function(event) {
		var location = enforceBounds(bounds, event.latLng);
		placeMarker(myMarker, location);
// 		updateLatLng(location);
// 		updateLatLngDMS(location);
//		updateLatLngFollow(myFollowMarker, dropPrecision(event.latLng, bounds));
//		map.panTo(location);
	});
}

//switches between displaying map and the form
function displayMap(x) {
	if (x) {
		$('googlemap').style.display = 'block';
		$('map_canvas').style.display = 'block';
		$('map_canvas').style.position = 'fixed';
		$('map_canvas').style.top = "0px";
		$('map_canvas').style.left = "0px";
		$('contents').style.display = 'none';
	} else {
		$('map_canvas').style.display = 'none';
		$('contents').style.display = 'block';
	}
}

// acks the marker being chosen
// then sets fields of the morc object
// and switches back from the map to the form view
// TODO: Add code for clustering markers into the same latlng position
function submitLatLng(location) {
	morc.loc = new latlng(location.lat(), location.lng());
	morc.from = "chosen";
	displayMap(false);
	var activityImageDiv = document.getElementById('activityImage').parentNode;
	activityImageDiv.innerHTML = "";
	var activityImage = document.createElement('img');
	activityImage.id = 'activityImage';
	activityImage.src = morc.file.dataurl;
	activityImageDiv.appendChild(activityImage);
}

// This function fills an html div with the contents of the map latlng control
// TODO: set more id's/classes here and move styling to stylesheets
function createGotoControl(ctrlDiv, map, marker, center)
{
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

	var INSTRUCTIONS = "Please enter the latitude and longitude for the place in your photo. Click <strong>'Take me there!'</strong> to find this place on the map.  If the map takes you to the right place, click <strong>'Submit!'</strong>"
	
	var welcomeMsgDiv = document.createElement('div');
	welcomeMsgDiv.id = "welcomeTxt";
	welcomeMsgDiv.name = "welcomeTxt";
	welcomeMsgDiv.style.textAlign = 'left';
	welcomeMsgDiv.innerHTML = INSTRUCTIONS;

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
		placeMarker(marker, new google.maps.LatLng(latValue, longValue));
	});

	google.maps.event.addDomListener(ctrlSubmitBtn, 'click', function (event) {
		// BUG: If you move the marker out of bounds and click submit, this function still submits
		// TODO: bounds checking?

		var latitude;
		var longitude;
		
		if (ctrlDecimalOrDMSSelect.selectedIndex == "1") {
			if (ctrlLatNS.selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (ctrlLongNS.selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
			
			latitude = toDecimal(latDirection, ctrlLatDegrees.value, ctrlLatMinutes.value);
			longitude = toDecimal(longDirection, ctrlLongDegrees.value, ctrlLongMinutes.value);
		}
		else {
			latitude = ctrlLatInput.value;
			longitude = ctrlLongInput.value;
		}
		var location = new google.maps.LatLng(latitude, longitude);
		submitLatLng(location);
		document.getElementById("googlemap").style.height="0px";
	});

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
}

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
	var seconds = Math.round((minutes_seconds % 1) * 60 * 100);
	seconds = seconds.toFixed();
	
	return {
		'compass': compass,
		'degrees': degrees,
		'minutes': minutes + "." + seconds
	};
}

function toDecimal(direction, deg, minutes) {
	minutes = parseFloat(minutes);
	deg = parseFloat(deg);
	var seconds = (Math.floor(minutes) * 60) + ((minutes % 1) * 100);
	
	var degrees = deg + (seconds / 3600);
	if ((direction == "W") || (direction == "S")) {
		degrees = degrees * -1;
	}

	return degrees;
}

function updateLatLng(location) {
	document.getElementById('latitudeIn').value = location.lat().toFixed(5);
	document.getElementById('longitudeIn').value = location.lng().toFixed(5);
}

// currently unused.
function updateLatLngFollow(marker, location) {
//	newLocation = dropPrecision(location);
	document.getElementById('latitudeInFollow').value = location.lat().toFixed(5);
	document.getElementById('longitudeInFollow').value = location.lng().toFixed(5);
	marker.setPosition(location);
	marker.setVisible(true);
}

function updateLatLngDMS(location) {
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
}

// Called when the user clicks the "Take me there!" button
function placeMarker(marker, location) {
	updateLatLng(location);
	updateLatLngDMS(location);
	marker.setPosition(location);
	marker.getMap().panTo(location);
}


// Currently unused, but will be rolled out soon.
// We use this to reduce precision of LatLng's in order to 'clump' near locations together.
// The gist is: Take each coord.
//	Multiply by 1000 and use Math.floor() to drop the decimals.
//	Divide by 1000 to get it back to a coord.
//	Add .0005 to "center"
// function reducePrecision(location) {
// 	latitude = Math.floor(location.lat() * 1000) / 1000 + .0005;
// 	longitude = Math.floor(location.lng() * 1000) / 1000 + .0005;
// 	
// 	newLoc = new google.maps.LatLng(latitude, longitude);
// 	if (bounds.contains(newLoc)) {
// 		return (newLoc);
// 	}
// 	// adjust latlng if coord falls out of bounds
// 	else {
// 		if (latitude < bounds.getSouthWest().lat())
// 			latitude = bounds.getSouthWest().lat();
// 		else if (latitude > bounds.getNorthEast().lat())
// 			latitude = bounds.getNorthEast().lat();
// 		if (longitude < bounds.getSouthWest().lng())
// 			longitude = bounds.getSouthWest().lng();
// 		else if (longitude < bounds.getNorthEast().lng())
// 			longitude = bounds.getNorthEast().lng();
// 
// 		return(new google.maps.LatLng(latitude, longitude));
// 	}
// }

function enforceBounds(bounds, location) {
	if (bounds.contains(location)) {
		return (location)
	}
	else {
		var latitude = location.lat();
		var longitude = location.lng();

		if (latitude < bounds.getSouthWest().lat()) {
			latitude = bounds.getSouthWest().lat();
		}
		else if (latitude > bounds.getNorthEast().lat()) {
			latitude = bounds.getNorthEast().lat();
		}
		if (longitude < bounds.getSouthWest().lng()) {
			longitude = bounds.getSouthWest().lng();
		}
		else if (longitude > bounds.getNorthEast().lng()) {
			longitude = bounds.getNorthEast().lng();
		}
		return(new google.maps.LatLng(latitude, longitude));
	}
}
