/**
 * @author sabareesh kkanan subramani
 * Contributions by BillSanders
 * Instantiates the object morc from drag and drop
 * compresses the image
 * finds geo location of image
 * If geo location is not found displays map which allows user to select a location from it.
 */

 // Nice global variable up here...
 // Wanted to move the string to an easy to find spot in case it ever needs to be changed in the future.
 var NEW_ACTIVITY_MAP_INSTRUCTIONS="Please enter the latitude and longitude for the place in your photo. Click <strong>'Take me there!'</strong> to find this place on the map.  If the map takes you to the right place, click <strong>'Submit!'</strong>"

 
// geocompress is the main point of entry into this file.
// As of Aug 8, 2012, only called from dragdrop.js
// creates the media object that has compressed image data url and geo co-ordinates
// This is eventually POST'd in upload.php
function geocompress(file, type) {
	this.file = compress(file, type);
	this.loc = gpsverify(file);  // If gps coords not embedded, will start google map
	this.verify = function() {
		if (this.file.dataurl && this.loc.lat() && this.loc.lng()) {
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
	return rect.topleft.lat() < loc.lat() && rect.bottomright.lat() > loc.lat() && rect.topleft.lng() < loc.lng() && rect.bottomright.lng() > loc.lng();
}

// If gps coords not embedded, will start google map UI for manual user GPS entry
function gpsverify(file) {
	var loc = new Object();
	var binary_reader = new FileReader();
	binary_reader.readAsBinaryString(file);

	binary_reader.onloadend = function(e) {
		var jpeg = new JpegMeta.JpegFile(e.target.result, file.name);
		if (jpeg.gps && jpeg.gps.longitude) {
			var x = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
			if (checkloc(huntboundary, x)) {
//			var gps_loc = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
//			if (huntboundary.contains(gps_loc)) { //  <- currently doing nothing.
				loc.latlng = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
				loc.from = "Native";
			}
			else {
				alert("not inside the boundary");
			}
		}
		else {
			alert("The image you've selected is not geo tagged.\nPlease click on the location where you have taken the picture.\nOnce you have selected the right spot, please click 'Submit'");
			instantiateGoogleMap();
		}
	}
	return loc;
}

// This function builds the map interface with the proper locations, bounds, etc.
function instantiateGoogleMap() {
	var x = new Object();

	//boundary
	var southWestBound = new google.maps.LatLng(huntboundary.topleft.lat(), huntboundary.topleft.lng());
	var northEastBound = new google.maps.LatLng(huntboundary.bottomright.lat(), huntboundary.bottomright.lng());
	var bounds = new google.maps.LatLngBounds(southWestBound, northEastBound);
	
	var map = initializeMap(bounds.getCenter().lat(), bounds.getCenter().lng(), document.getElementById("main"));

	map.fitBounds(bounds);

	// Creates the Rectangle overlay on the map.
	createRectangleOverlay(map, bounds);
	
	var myMarker = new google.maps.Marker(
	{
		position: bounds.getCenter(),
		draggable: true,
		map: map
	});

	var gotoControl = createGotoControl(map, bounds.getCenter(), GoToControlOnSubmit, myMarker, true);

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

// acks the marker being chosen
// then sets fields of the morc object
// and switches back from the map to the form view
// TODO: Add code for clustering markers into the same latlng position
function submitLatLng(location) {
	morc.loc = new google.maps.LatLng(location.lat(), location.lng());
	morc.from = "chosen";
	removeMap();
	document.getElementById("activity").innerHTML=multiple;
	var activityImageDiv = document.getElementById('activityImage').parentNode;
	activityImageDiv.innerHTML = "";
	var activityImage = document.createElement('img');
	activityImage.id = 'activityImage';
	activityImage.src = morc.file.dataurl;
	activityImageDiv.appendChild(activityImage);
}

// The function that is called when the GoToControl Submit button is clicked.
function GoToControlOnSubmit(event) {
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
