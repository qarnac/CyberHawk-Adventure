/*
* Common scripts needed
* handles ajax
* handles selection of a hunt activity
* Creates activitiy array
* Wherever you see variable x it is a temporary varibale used for multiple operations
*/

//invoked by ajax function but loaded when the page is finished loading. THis receives the hunts from the server and it transfers it to javascript variable hunts
function createHuntList(x) {
	hunts = JSON.parse(x);
	$('username').innerHTML = hunts[0];
	hunts = hunts[1];
	sessionStorage.hunts=JSON.stringify(hunts);
	for ( x = 0; x < hunts.length; x++)
		$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]['id']);
}

//Creates some random number
var uniq = Math.floor((Math.random() * 100) + 1);
//shortcut to get object with their id
function $(x) {
	return document.getElementById(x);
}

//var PHP_FOLDER_LOCATION="http://ouyangdev.cs.csusm.edu/cyberhawk/quest/php/";

//this function is invoked when a teacher selects a hunt
function huntsel() {
	$('activity').innerHTML = '';
	$('students').innerHTML = '';
	ajax("what=activities&id=" + document.getElementById("selecthunt").value, PHP_FOLDER_LOCATION + 'getHunts.php', create_activity_obj);
	createTeacherMap();
	if(document.getElementById("mapButton")==null){
		var button=document.createElement("input");
		button.setAttribute("type", "button");
		button.setAttribute("value", "List View");
		button.setAttribute("id", "mapButton");
		button.onclick=mapListButton;
		document.getElementById("contentSection").insertBefore(button, document.getElementById("newhunt"));
	}
	mapListButton();
}

//creates a dom element
function createElement(x, y) {
	x = document.createElement(x);
	x.innerHTML = y;
	return x;
}

//Pretty sure we could refactor these two prototype functions out and just use array's .indexOf() which returns -1

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
