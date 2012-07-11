/**
 * @author sabareesh kkanan subramani
 * Contributions by BillSanders
 * Instantiates the object morc from drag and drop
 * compresses the image
 * finds geo location of image
 * If geo location is not found displays map which allows user to select a location from it.
 */
//creates the media object that has compressed image data url and geo co-ordinates
function geocompress(file, type) {
	this.file = compress(file, type);
	this.loc = gpsverify(file);
	this.verify=function(){if(this.file.dataurl && this.loc.latlng){this.file.dataurl=this.file.dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");return true;}else return false;} 
}

// TODO: What type of object is 'x'?  What type of object is morc?
//Compresses the image by first by resizing the image to smaller size and converting the resized image to jpeg dta url with quality of 0.8
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
			} else {
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

//checks whether a latlng point is inside a rectangle
function checkloc(rect, loc) {
	return rect.topleft.lat < loc.lat && rect.bottomright.lat > loc.lat && rect.topleft.lng < loc.lng && rect.bottomright.lng > loc.lng;
}

//gets meta data like the geo tag in the image. if doesnt exist gets it with help of google maps and user
function gpsverify(file) {
	var loc = new Object();
	var binary_reader = new FileReader();
	binary_reader.readAsBinaryString(file);

	binary_reader.onloadend = function(e) {
		var jpeg = new JpegMeta.JpegFile(e.target.result, file.name);
		if (jpeg.gps && jpeg.gps.longitude) {
			var x = new latlng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
			if (checkloc(huntboundary, x)) {
				loc.latlng = new latlng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
				loc.from = "Native";
			} else {
				alert("not inside the boundary");
			}

		} else {
			alert("The image you've selected is not geo tagged.\nPlease click on the location where you have taken the picture.\nOnce you have selected the right spot, please click 'Submit'");
			mapdisp(true);
			gmaps();
		}
	}
	return loc;
}

//finds the center of a rectangle
function rectcenter(x) {

	return new latlng((x.topleft.lat + x.bottomright.lat) / 2, (x.topleft.lng + x.bottomright.lng) / 2);

}
//google maps used to get the geo cordinates of picture inside a hunt area
function gmaps() {
	//map
	var x = new Object();
	var center = rectcenter(huntboundary);
	var myOptions = {
		center : new google.maps.LatLng(center.lat, center.lng),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.TERRAIN
	};
	var map = new google.maps.Map($("map_canvas"), myOptions);
	//boundary
	var rectangle = new google.maps.Rectangle();
	var bound = new google.maps.LatLngBounds(new google.maps.LatLng(huntboundary.topleft.lat, huntboundary.topleft.lng), new google.maps.LatLng(huntboundary.bottomright.lat, huntboundary.bottomright.lng));
	var rectOptions = {
		strokeColor : "#FF0000",
		strokeOpacity : 0.7,
		strokeWeight : 2,
		fillColor : "#FF0000",
		fillOpacity : 0.35,
		map : map,
		bounds : bound
	};
	rectangle.setOptions(rectOptions);
	
	var myMarker = new google.maps.Marker(
	{
		position: new google.maps.LatLng(center.lat, center.lng),
		draggable: true,
		map: map
	});

	var gotoControlDiv = document.createElement('div');
	var gotoControl = createGotoControl(gotoControlDiv, map, myMarker, new google.maps.LatLng(center.lat, center.lng));

	// Index is the order in which controls are rendered, all before default controls
	gotoControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(gotoControlDiv);

	google.maps.event.addListener(map, 'click', function(e) {
		alert("you can select location only within the hunt area \n Once selected Click again on the marker")
	});
	
	google.maps.event.addListener(myMarker, 'drag', function(event) {
		updateLatLng(myMarker, event.latLng);
	});

	google.maps.event.addListener(myMarker, 'dragend', function(event) {
		updateLatLng(myMarker, event.latLng);
	});

	google.maps.event.addListener(myMarker, 'click', function(event) {
		submitLatLng(myMarker, event.latLng);
	});

}
//switches between displaying map and the form
function mapdisp(x) {
	if (x) {
		$('map_canvas').style.display = 'block';
		$('contents').style.display = 'none';
	} else {
		$('map_canvas').style.display = 'none';
		$('contents').style.display = 'block';
	}
}

// acks the marker being chosen
// then sets fields of the morc object
// and switches back from the map to the form view
// TODO: don't need to pass the whole marker...
// TODO: Add code for clustering markers into the same latlng position
function submitLatLng(marker) {
	alert("Thanks for picking a location.");
	morc.loc = new latlng(marker.getPosition().lat(), marker.getPosition().lng());
	morc.from = "chosen";
	mapdisp(false);
	drawimg(morc);
}

// This function fills an html div with the contents of the map latlng control
// TODO: set more id's/classes here and move styling to stylesheets
function createGotoControl(ctrlDiv, map, marker, center)
{
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

	layoutLatLongBox = document.createElement('div');
	layoutLatLongBox.style.paddingBottom = '5px';
	layoutLatLongBox.style.paddingTop = '5px';
	layoutLatLongBox.style.textAlign = 'right';
	layoutLatLongBox.appendChild(ctrlLatLabel);
	layoutLatLongBox.appendChild(ctrlLatInput);
	layoutLatLongBox.appendChild(ctrlLongLabel);
	layoutLatLongBox.appendChild(ctrlLongInput);
	
	
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
	ctrlDiv.appendChild(layoutLatLongBox);
	ctrlDiv.appendChild(layoutBtnDiv);
	ctrlDiv.appendChild(document.createElement('br'));
	ctrlDiv.appendChild(document.createElement('hr'));
	ctrlDiv.appendChild(layoutSubmitBtnDiv);

	var onclick = function()
	{
		var latValue = ctrlLatInput.value;
		var longValue = ctrlLongInput.value;
		
		if (latValue < -90 || latValue > 90)
		{
			alert("The latitude must be between -90 and 90 degrees.");
		}
		else if (longValue < -180 || longValue > 180)
		{
			alert("The longitude must be between -180 and 180 degrees.");
		}
		else
		{
			dropMarker(marker, new google.maps.LatLng(latValue, longValue));
		}
	};

	// TODO: these checks are pointless?  Replace with bounds checking.
	var onsubmit = function()
	{
		var latValue = ctrlLatInput.value;
		var longValue = ctrlLongInput.value;
		
		if (latValue < -90 || latValue > 90)
		{
			alert("The latitude must be between -90 and 90 degrees.");
		}
		else if (longValue < -180 || longValue > 180)
		{
			alert("The longitude must be between -180 and 180 degrees.");
		}
		else
		{
			submitLatLng(marker, new google.maps.LatLng(latValue, longValue));
		}
	};

	google.maps.event.addDomListener(ctrlBtn, 'click', onclick);

	google.maps.event.addDomListener(ctrlSubmitBtn, 'click', onsubmit);
}


// Called when the user drags around the marker
function updateLatLng(marker, location) {
	document.getElementById('latitudeIn').value = location.lat().toFixed(5);
	document.getElementById('longitudeIn').value = location.lng().toFixed(5);
}

// Called when the user clicks the "Take me there!" button
function dropMarker(marker, location) {
	updateLatLng(marker, location);
	marker.setPosition(location);
}
