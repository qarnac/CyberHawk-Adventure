// studentActivityList.js is used in order to query the server
// and then display the list of activities that the student has already
// submitted.  It is also at this screen where the student can select to create a new Activity.

// This function is to be called whenever you want the activity div to list all of the
// students activities.
// If I find nothing else that I want to do before I call the php function, then I will move this into the html file.
// Currently called by:  Nothing.
function createStudentActivityList(){
	ajax('hunt=' + document.getElementById("selecthunt").value + // POSTS the huntid.
		"&name=" + document.getElementById("username").innerHTML,    // Posts student firstname
		PHP_FOLDER_LOCATION + "getStudentActivities.php", studentActivityList);  // Gives filename to post to and callback function.
}

// This function is called in order to create a new activity as a student.
// Shows the createActivity.html file.
function createNewActivity(){
	ajax("GET", "../quest/html/createActivity.htm", displayPage);
}

function displayPage(serverResponse){
	var activityDiv=document.getElementById("activity");
	activityDiv.innerHTML=serverResponse;
}

// This function is the callback function from createStudentActivityList()
// It's purpose is to parse the json, and then display it to the user.
function studentActivityList(serverResponse){
	document.getElementById('activity').innerHTML="";
	var activities=JSON.parse(serverResponse);
	if(document.getElementById("newActivity")==null){
		var button=document.createElement("input");
		button.setAttribute("type", "button");
		button.setAttribute("value", "New Activity");
		button.setAttribute("id", "newActivity");
		button.onclick=createNewActivity;
		document.getElementById("main").insertBefore(button, document.getElementById("contents"));
	}
	for(i in activities){
		displayactivity(activities[i], true);
	}
}
