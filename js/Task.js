/**
 * @author jason li
 * @date   10/23/2008
 */
function Task(_xmlFile)
{
	var me = this;

	me.xmlFile = _xmlFile;
	me.title = null;
	me.synopsis = null;
	me.level = null;
	me.lat = null;
	me.lng = null;
	me.markers = new Array();

	// user information
	me.playerScore = 0;
	me.gameStartTime = 0;
	me.playerTime = 0;
	me.questionFound = 0;
	me.questionSolved = 0;
	me.notes = "";
	
	me.bag = new Array();
	me.bagItemCount = 0;

	// 
	me.isStart = false;

	me.closestMarker = null;
	me.lastClosestMarker = null;
	me.needUpdateGUI = false;

}

// sort function for GLatLng list
function SortLatLng(a, b) {
	if (a.lat() < b.lat())
		return 1;
	else if ( a.lat()==b.lat())
		return 0;
	else
		return -1;
}

Task.prototype.addMarkersTo = function(ge, gm) {
	var me = this;
	
	var latlngList = new Array();
	
	for(var i = 0; i < task.markers.length; i++)
	{
		me.markers[i].initGEMarker(ge);
		me.markers[i].addGEMarker(ge);

		me.markers[i].initGMMarker(gm);
		me.markers[i].addGMMarker(gm);
	
		latlngList[i] = new GLatLng(me.markers[i].lat, me.markers[i].lng);
	}

	for (var i = 0; i < MODEL_BUILDS.length; i++) { 
		var model_name = MODEL_PATH + MODEL_BUILDS[i];
		//alert(model_name);
		google.earth.fetchKml(ge, model_name, function(kmlObject) { 
				if (kmlObject) { 			
				  ge.getFeatures().appendChild(kmlObject); 
				}}); 
	} 

	
	
	latlngList.sort(SortLatLng); // sort the markers from low latitude to high latitude
	// generate path in side map
	var polyline = new GPolyline(latlngList, "#ff0000", 2);
	gm.addOverlay(polyline);
	
	
	/*
	//Ouyang (June 20): Testing animation
	var loc = ge.createLocation('');
	loc.setLatitude(me.markers[0].lat);
	loc.setLongitude(me.markers[0].lng);
	
	//set up the red circle first
	var redmodel = ge.createModel('');
	redmodel.setLocation(loc);
	me.circleLink = ge.createLink('');
	me.circleLink.setHref(me.sketchuppath + 'redcircle/models/redcircle.dae');
	redmodel.setLink(me.circleLink);

	me.circlePlacemark.setGeometry(redmodel);
	ge.getFeatures().appendChild(me.circlePlacemark);
	*/
	
	/*
	//Ouyang (June 17): fetching KML files to add placemarkers or sketchup models
	var originalLat = me.markers[0].lat;
	var originalLng = me.markers[0].lng;
	var delta = 0.01;

	//sketchup model was exported to kmz file, renamed to zip, and unzipped
	var kmlUrl = "http://ouyangprod.cs.csusm.edu/AnzaBorrego/sketchup/redcircle.kmz";
    google.earth.fetchKml(ge, kmlUrl, finishFetchKml);
	
	*/
	
}	//end of addMarkersTo

/* testing how to fetch KML file 
function finishFetchKml(kmlObject) 
{  // check if the KML was fetched properly
	  if (kmlObject) {
		// add the fetched KML to Earth
		var children = ge.getFeatures().getChildNodes();	//of type KmlObjectList
		var oldest = children.item(0);	//first child
		oldest.setVisibility(false);
		//setTimeout(function() {  alert('first child: ' + oldest.getType() + ' ' + oldest.getName());  }, 0);  
		
		ge.getFeatures().appendChild(kmlObject);
	  } else {
		// wrap alerts in API callbacks and event handlers
		// in a setTimeout to prevent deadlock in some browsers
		setTimeout(function() {  alert('Bad or null KML.');  }, 0);  
		}
}	//end of finishFetchKML
*/

Task.prototype.start = function()
{
	var me = this;
	var dateObject = new Date();
	me.gameStartTime = parseInt(dateObject.getTime()/1000);
	me.isStart = true;
}

Task.prototype.end = function()
{
	me.isStart = false;
}

Task.prototype.updateNotes = function(message)
{
	var me = this;
	//alert("You got " + addtionScore + " bonus points");
	me.notes = message;	
}

Task.prototype.saveItemToBag = function(title, imgUrl, note) {
	var me = this;
	
	me.bag[me.bagItemCount] = new Object();
	me.bag[me.bagItemCount].title = title;
	me.bag[me.bagItemCount].imgUrl = imgUrl;
	me.bag[me.bagItemCount].note = note;

	me.bagItemCount++;	
}

Task.prototype.reward = function(addtionScore)
{
	var me = this;
	//alert("You got " + addtionScore + " bonus points");
	me.playerScore += addtionScore;	
}

Task.prototype.solveProblem = function(closestMarker)
{
	var me = this;
	me.playerScore += 10;	
	me.questionSolved += 1;
}

Task.prototype.updatePlayerInfo = function()
{
	var me = this;
	var dateObject = new Date();
	var totalSeconds = parseInt(dateObject.getTime()/1000 - me.gameStartTime);
	var minutes = parseInt(totalSeconds / 60);
	var seconds = totalSeconds % 60;
	var timeMsg = "0:";
	if (minutes < 10) {
		timeMsg += "0";
	}
	timeMsg	+= minutes + ":";
	if (seconds < 10) {
		timeMsg += "0";
	}
	timeMsg += seconds;
	
	if ( document.getElementById("playerscore") )
	document.getElementById("playerscore").innerHTML = me.playerScore;
	if ( document.getElementById("playertime") )
	document.getElementById("playertime").innerHTML = timeMsg;
	if ( document.getElementById("questionfound") )
	document.getElementById("questionfound").innerHTML = me.questionFound;
	if ( document.getElementById("questionsolved") )
	document.getElementById("questionsolved").innerHTML = me.questionSolved;
	
}

Task.prototype.refresh = function(centLat, centerLong)
{    
	var me = this;
    // Makes sure that the map is initialized and game started
    if(ge && me.isStart)
    {
		me.closestMarker = null;

		// Check if the car is around any of the markers
		for(var i = 0; i < me.markers.length; i++)
		{
			// Only stop the car once for each marker.
			// Ouyang: how is the above achieved by checking airborne?
			if( !truck.isAirborne)
			{
				var latDistance = centLat - task.markers[i].lat;
				var longDistance = centerLong - task.markers[i].lng;
				
				//alert("latDistance: " + latDistance + "    Long Distance: " + longDistance);
				
				if(latDistance < 0) latDistance = latDistance * -1;
				if(longDistance < 0) longDistance = longDistance * -1;
					
				var requiredDistanceToActivate = .0019; //default value by paul is 0.0019
				if(latDistance <  requiredDistanceToActivate && longDistance < requiredDistanceToActivate)
				{
					me.closestMarker = me.markers[i];
					// Ouyang: can we guide the eagle to land on the marker?
					break;
				} 
			} 
		}

		// Update the page if the closestMarker changes
		if(me.closestMarker != me.lastClosestMarker) {
			me.needUpdateGUI = true;
			me.lastClosestMarker = me.closestMarker;
		} else {
			me.needUpdateGUI = false;
		}

		me.updatePlayerInfo();
     }
}

Task.prototype.parse = function()
{
    var me = this;
	var xmlDOM = LoadXML(me.xmlFile); 

    // get root of the XML file
    var root = xmlDOM.documentElement;
    try
    {
		var items = root.selectNodes("//task");
	

		this.title = GetNodeValue(items[0].selectSingleNode("title"));
		this.synopsis = GetNodeValue(items[0].selectSingleNode("synopsis"));
		this.level = GetNodeValue(items[0].selectSingleNode("level"));
		this.lat = parseFloat(GetNodeValue(items[0].selectSingleNode("latitude")));
		this.lng = parseFloat(GetNodeValue(items[0].selectSingleNode("longitude")));
		this.heading = parseInt(GetNodeValue(items[0].selectSingleNode("heading")));
		
		//Ouyang: not sure if the following four lines are still useful since the min/max lat/lng are now used to detect boundary
		this.zonetopleftlat = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/topleft/lat")));
		this.zonetopleftlng = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/topleft/lng")));
		this.zoneheight = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/height")));
		this.zonewidth = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/width")));

		//Ouyang: Use min/max lat/lng to detect boundary
		this.zoneMinLAT = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/minlat")));
		this.zoneMinLNG = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/minlng")));
		this.zoneMaxLAT = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/maxlat")));
		this.zoneMaxLNG = parseFloat(GetNodeValue(items[0].selectSingleNode("zone/maxlng")));
		
		//alert("TASK:"+this.title+","+this.synopsis+","+this.level+","+this.lat+","+this.lng);
		items = root.selectNodes("//task/markers/marker");
		for(var i=0;i<items.length;i++)
		{
			var strTitle = GetNodeValue(items[i].selectSingleNode("title"));
			var strSynopsis = GetNodeValue(items[i].selectSingleNode("synopsis"));
			var strLat=parseFloat(GetNodeValue(items[i].selectSingleNode("latitude")));
			var strLng=parseFloat(GetNodeValue(items[i].selectSingleNode("longitude")));
			var strIco=GetNodeValue(items[i].selectSingleNode("icon"));
			var strType = items[i].getAttribute("type");
			
			//AnzaMarker(_type, _title, _synopsis, _lat, _lng, _icon)
			this.markers[i] = new AnzaMarker(strType,strTitle,strSynopsis,strLat,strLng,strIco);

			var pageContent = items[i].selectSingleNode("content");

			var subPages = pageContent.selectSingleNode("pages");
			var strPageDir = GetNodeValue(pageContent.selectSingleNode("page_dir"));
			
			var subitems = subPages.selectNodes("page");

			//Ouyang: This loop retrieves the pages from the xml file
			for (var j = 0; j < subitems.length; j++) {
				//alert(subitems[j].childNodes[0].nodeValue);
				//alert(subitems[j].nodeValue);
				//alert(getText(subitems[j]));
				// only postfix 'htm' works 

				var strName = GetNodeValue(subitems[j].selectSingleNode("name"));
				var strFilename = GetNodeValue(subitems[j].selectSingleNode("path"));
				var strStatus = parseInt(GetNodeValue(subitems[j].selectSingleNode("status")));
				var strPath = strPageDir + strFilename;
				//alert(strFilename + ", " + strName);
				this.markers[i].addPage(strPath, strName, strStatus);
			}
			
			//this.markers[i].addPage("./task/notes.htm", "Notes", 1);
			//this.markers[i].addPage("./task/bag.htm", "Bag", 1);
		}
    }
    catch(exception)
    {
        alert("error");
    }	
}

