/*
* Common scripts needed
* handles ajax
* handles selection of a hunt activity
* Creates activitiy array
* USED by welcome.php
* Wherever you see variable x it is a temporary varibale used for multiple operations
*/

//invoked by ajax function but loaded when the page is finished loading. THis receives the hunts from the server and it transfers it to javascript variable hunts
function init(x) {
	hunts = JSON.parse(x);
	$('username').innerHTML = hunts[0];
	hunts = hunts[1];
	for ( x = 0; x < hunts.length; x++)
		$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], x);
}

//Creates some random number
var uniq = Math.floor((Math.random() * 100) + 1);
//shortcut to get object with their id
function $(x) {
	return document.getElementById(x);
}


//ajax POST request
function ajax(data, url, callback) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (xmlhttp.responseText == 'sessionfail')
				window.location = '../';
			callback(xmlhttp.responseText);
		}
	}
	if(data=="GET")
	{
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	}
	else{
		xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(data);
	}
	
}

//this function invoked when student selects a hunt
function huntsel(x) {
	$('activity').innerHTML = '';
		$('students').innerHTML = '';
	if (x != 'null') {
		var hunt = hunts[x];
		ajax("what=activities&id=" + hunt['id'], PHP_FOLDER_LOCATION + 'user_retreive.php', create_activity_obj);

	} else {
		
		feed = {};
		activities = [];
	}
}

//creates a dom element
function createElement(x, y) {
	x = document.createElement(x);
	x.innerHTML = y;
	return x;
}

// a custom prototype thats been added to array object to find existence of particular value
Array.prototype.has = function(v) {
	for ( i = 0; i < this.length; i++) {
		if (this[i] == v)
			return true;
	}
	return false;
}
//A custom prototype verifies whether paticular id exist inside the array
Array.prototype.hassid = function(v) {
	for ( i = 0; i < this.length; i++) {
		if (this[i].sid == v)
			return i;
	}
	return "false";
}
