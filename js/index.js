/*
Copyright 2009
Department of Computer Science & Information Systems (CSIS)
California State University San Marcos (CSUSM)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This project was created by these people from the CSIS Department of CSUSM:
Jiexin Li
Paul Mendoza
Youwen Ouyang

It is part of the CyberTEAM project that was funded by the National Science Foundation.
More information about CyberTEAM can be found at http://www.csusm.edu/cyberteam/
*/

function isDynamicPage(path) {
	return path.charAt(path.length-1) == '/';
}

// open the main page (either earth page or question page)
// Ouyang: how could 3d sketchup model be loaded, probably in Task.js?			
function openPage(id) {
	var geDiv = document.getElementById("map3d_container");
	var pcDiv = document.getElementById("page_container");

	// open the google earth page 
	if ( id == 0 ) {
		geDiv.style.width = "100%";
		geDiv.style.height = "400px";
		pcDiv.style.display = "none";
		EnableControlKeys();
	} else { // open a question page 
		// stop the truck first 
		truck.vel[0] = 0;
		truck.vel[1] = 0;
		// hide the google earth page
		geDiv.style.width = "0px";
		geDiv.style.height = "0px";
		// show the question page 
		pcDiv.style.display = "block";
		DisableControlKeys();
		
		var pagePath;
		if ( id == 99) {
			pagePath = "/task/bag.htm";
		} else {
			pagePath = task.closestMarker.getPagePath(id);
		}		
		
		if (isDynamicPage(pagePath)) {
			pagePath = "/pages/";
			pagePath += "lat=" + task.closestMarker.lat + "&" + "lon=" + task.closestMarker.lng + "&";
			pagePath += "page=" + id + "&";
			pagePath += "activity=1";
		}
		
		// load external question page
		var defaultIframe='<iframe id="myframe" src="' + pagePath + '" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" class="tabcontentiframe" style="width:100%; height:100%; min-height: 100px"></iframe>'

		pcDiv.innerHTML = defaultIframe;
	}
}


// updates the page tab bar
function updatePageBar(id) {
	var pagebar = document.getElementById("pagebar");

	var html = "";
	if ( id == 0 ) {
		html = '<span class="page_now">Earth <img src="images/icon/earth.png"/></span>';
	} else {
		html = '<a href="javascript:openTabPage(0)">Earth <img src="images/icon/earth.png"/></a>';
	}

	var pageNum = 0;
	if ( task && task.closestMarker ) pageNum = task.closestMarker.pageCount;
	for (var k = 1; k <= pageNum; k++) {
		var tagname = task.closestMarker.getPageName(k);
		var status = task.closestMarker.getPageStatus(k);

		// set tag icons
		if ( status == 0 ) continue; // hide some pages
		else if ( status == 2 ) {
			tagname = tagname + " <img src='images/icon/apply.png' />";
		} else if ( status == 3) {
			tagname = tagname + " <img src='images/icon/question.png' />";			
		} else {
			if ( tagname == "Notes" )  
				tagname = tagname + " <img src='images/icon/notepad.png' />";
			else if ( tagname == "Intro" || tagname == "Slides" || tagname == "Clue" )
				tagname = tagname + " <img src='images/icon/info2.png' />";
			else {
				tagname = tagname + " <img src='images/icon/question.png' />";
			}
		}

		if ( id == k ) {
			html += '<span class="page_now">' + tagname + '</span>';
		} else {
			html += '<a href="javascript:openTabPage(' + k + ')">' + tagname + '</a>';
		}
	}

	if ( id == 99 ) {
		html += '<span class="page_now">Bag <img src="images/icon/tools.png"/></span>';
	} else {
		html += '<a href="javascript:openTabPage(99)">Bag <img src="images/icon/tools.png"/></a>';
	}	
	
	pagebar.innerHTML = html;
}

// Updates the information box
function updateInfoBox(id) {
	var info = "";
	var lineElem = document.getElementById('info_content');
	if (id != 0) {
		info = "To go back to Google Earth, click on the Earth tab."
	} else	if ( lineElem ) {
		if ( task == null || task.closestMarker == null ) {
			info = "Nothing Around. Use the Large Scale option to see what's nearby!" +
				"When you get closer, don't forget to switch to the Small Scale to be more accurate."; 
		} else {
			info += "You have arrived at " + task.closestMarker.title;
			info += ". Use the space bar to pause the flight. Click on the tabs to find more activities related to ";
			info += task.closestMarker.synopsis;
		}
	}
	lineElem.innerHTML = info;
}

//Ouyang: the type parameter distinguish the display of the message. This function is currently called to update the message
//box according to user's response to questions.
function appendMessageToInfoBox(msg, type) {
	var info;
	if ( type == "hint" )
		info = "<span style='color:black;background-color:yellow;' >" + msg + "</span><br />";
	else if ( type == "yes" )
		info = "<span style='color:blue;background-color:yellow;' >" + msg + "</span><br />";
	else
		info = msg;
	var lineElem = document.getElementById('info_content');
	lineElem.innerHTML = info;	//Ouyang: doesn't seem to be necessary to keep the original: + lineElem.innerHTML;
}

// open the main page and updates both pagebar and the information box
function openTabPage(id) {
	openPage(id);
	updatePageBar(id);
	updateInfoBox(id);
}
