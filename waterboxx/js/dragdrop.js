///image valid
/*
 * This file handles all the drag and drop functionality.
 * Creates a global varialble morc which stores the image information such as dataurl,geolocation
 
 
  */
 //checks validity of image
function validimg(url) {

	if (!checkURL(url)) {
		alert("It looks like the url that you had provided is not valid! Please only submit correct image file. We only support these extensions:- jpeg, jpg, gif, png.\n The url provided was \n" + url);
		return (false);
	} else
		return true;

	// can't submit the form yet, it will get sumbitted in the callback
}
//supported formats
function checkURL(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
//initialises the file api
function starter() {
	// call initialization file
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		Init();

	} else {
		alert('The File APIs are not fully supported in this browser.');
	}

}

// initialize
function Init() {

	var xhr = new XMLHttpRequest();
	if (xhr.upload) {

		c_h5 = true;
		//html5 supported
	} else
		alert("please update your browser");

}

// output information
function Output(msg, dest) {
	dest.innerHTML = msg;
}

// file drag hover
function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "filedrag hover" : "filedrag");
}

// file selection handler
// FileSelectHandler is called from "/quest/user/htm/multiple.htm" on a drag and drop event, or the onchange event of the image input on that page

// note: morc is a global variable
// 'morc' is eventually set as contents['media'] in user/js/wscript.js
// which is then sent in a POST to upload.php as 'media' after being JSON.stringify'd
var morc; // image object with compressed image with geo location

function FileSelectHandler(e) {

	FileDragHover(e);
	var files = e.target.files || e.dataTransfer.files;
	if (files.length >= 1) {
		var obj = new geocompress(files[0], "file");
		morc = obj;

	}
	else {
		if (validimg(e.dataTransfer.getData("text/uri-list"))) {
			if (c_alldata.length < media.count) {
				geocompress(e.dataTransfer.getData("text/uri-list"), "iurl");
			}
			else {
				alert("Media content is Full delete some to add new ");
			}
		}
		else {
			// what happens here?
		}
	}

}
