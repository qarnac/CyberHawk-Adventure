function SideMap(topMap) {
	var me = this;

	me.topMap = topMap;
	me.mapLevel = 11;

	me.centLat = 33.271273;
	me.centerLong = -116.403151;
	me.heading = 90;
	me.centerAlt = 0;

	me.loopCounter = 0;
	me.carMarker = null;

	me.imagepath = "images/hawks/car_left_";
	var carIcon;
	var markerOptions;
	var widthOfCar = .000020;
	var heightOfCar = .000030;

	if (!me.topMap) return;
	me.topMap.setCenter(new GLatLng(me.centLat, me.centerLong), me.mapLevel);
	me.topMap.setMapType(G_SATELLITE_MAP);
	// Create our "tiny" marker icon
	carIcon = new GIcon(G_DEFAULT_ICON);
	carIcon.image = me.imagepath+"0.png";
	carIcon.iconSize = new GSize(40, 40);
	carIcon.shadowSize = new GSize(1, 1);
	carIcon.iconAnchor = new GPoint(12, 12);
	carIcon.infoWindowAnchor = new GPoint(5, 1);
	markerOptions = { icon:carIcon };

	var point = new GLatLng(me.centLat,me.centerLong);
	me.carMarker = new GMarker(point, markerOptions);
	me.topMap.addOverlay(me.carMarker);
}

SideMap.prototype.setZoomLevel = function(lv) {
	var me = this;

	me.mapLevel = lv;
	me.topMap.setCenter(new GLatLng(me.centLat, me.centerLong), me.mapLevel);
}

SideMap.prototype.refresh = function(centLat, centerLong, centerAlt, heading )
{
	var me = this;

	me.centLat = centLat;
	me.centerLong = centerLong;
	me.centerAlt = centerAlt;
	me.heading = heading;

    // Makes sure that the map is initialized
    if(ge)
    {
        me.loopCounter++;
        
        if(me.loopCounter % 10 == 0)
        {
            me.topMap.setCenter(new GLatLng(me.centLat, me.centerLong), me.mapLevel); 
            
			// Do this because the way we generate the image headings are backwards.
            me.heading = me.heading * -1; 

            // Calculate image to use.
            if(me.heading < 0)
                me.heading = 360 + me.heading;
            var closestHeadingDirection = Math.round(me.heading / 10)*10;
            var locationOfFile = me.imagepath + closestHeadingDirection + ".png";
            //if(!reachedPlace) { alert("Reached line" + locationOfFile); reachedPlace = true; }
            me.carMarker.setImage(locationOfFile);
            
            // We subtract .001 from the location for the top view car marker because the Longitude on the top view isn't exactly lined
            // up with the marker locations on the 3D view. The .001 accounts for that discrepecny. -- Added by Paul
            var point = new GLatLng(me.centLat,me.centerLong - .001);
            me.carMarker.setLatLng(point);
            //var point = new GLatLng(centLat,centerLong);
            //var movingMarker = new GMarker(point, markerOptions);
            //topMap.addOverlay(movingMarker);
            
        } // Loop count check to prevent extra processing.

        if(me.loopCounter > 100000)
        {
            me.loopCounter = 0;
        }
     }
}
