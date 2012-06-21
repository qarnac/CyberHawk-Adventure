/**
 * @author sabareesh kkanan subramani
 * Instantiates the object morc from drag and drop
 * compresses the image
 * finds geo location of image
 * If geo location is not found displays map whilch allows user to select a location from it.
 */
//creates the media object thta has compressed image data url and geo co-ordinates
function geocompress(file, type) {
	this.file = compress(file, type);
	this.loc = gpsverify(file);
	this.verify=function(){if(this.file.dataurl && this.loc.latlng){this.file.dataurl=this.file.dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");return true;}else return false;} 
}
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
			alert("Image is not geo tagged.\n Please click on location where you have taken picture. \n Once you selected please click again on the marker ");
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
	//click event for selecting a location
	google.maps.event.addListener(rectangle, 'click', function(e) {
		placeMarker(e.latLng);
	});
	google.maps.event.addListener(map, 'click', function(e) {
		alert("you can select location only within the hunt area \n Once selected Click again on the marker")
	});
	var marker;

	function placeMarker(location) {
		if (marker) {
			marker.setPosition(location);
			marker.setTitle(location.lat() + "," + location.lng());
		} else {
			marker = new google.maps.Marker({
				position : location,
				map : map,
				title : location.lat() + "," + location.lng()
			});
			google.maps.event.addListener(marker, 'click', function(e) {
				alert("Thanks for choosing a location ");
				x.from = "chosen";
				x.latlng = new latlng(marker.getPosition().lat(), marker.getPosition().lng());
				morc.loc = x;
				mapdisp(false);
				drawimg(morc);
			});

		}
	}

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
