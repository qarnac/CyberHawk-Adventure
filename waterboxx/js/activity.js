/**
 * @author sabareesh kkanan subramani
 * Additions by Bill Sanders and Jeff Rackauckas
 */
var hunts;
// All the hunts from the teacher will be stored in this variable

var activities = new Array();
// Holds all the activities of a particular hunt organised by student id

var feed = {};
// Has the status of each activity like its id,comment and status.


//Instantiates the array activities with student activitivities
//This function is invoked by ajax function but this happens when the teacher selects a hunt.
//It creates the list of all students and display them in the list box along with a update button.
//It also creates the array activities .
function create_activity_obj(allActivities) {
	if (allActivities == "none")//server returns false if it cannot find any activities
		alert("No one has created an activity yet");
	else {
		activityList = JSON.parse(allActivities);	
		for ( var i = 0; i < activityList.length; i++) {
				$('activity').appendChild(generateActivityView(activityList[i], false, i));
			}
	}
	
	
}

// Wrapped into function due to the multiple times this is done.
function fillAnswerDiv(Dom, answer){
	if(answer==""){
		Dom.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		Dom.className = "unansweredQuestion";
	} else{
		Dom.innerHTML=answer;
	}
}

// Is used to populate the activityView.html file.
function fillActivityTable(activity, isStudent, tableNumber){
	fillAnswerDiv(document.getElementsByName("partner_names")[tableNumber], activity.partner_names);
	fillAnswerDiv(document.getElementsByName("date_planted")[tableNumber], activity.date_planted);
	fillAnswerDiv(document.getElementsByName("date_observed")[tableNumber], activity.date_observed);
	document.getElementsByName("successful")[tableNumber].innerHTML=(activity.successful==1)? "Yes" : "No";
	fillAnswerDiv(document.getElementsByName("height")[tableNumber], activity.height);
	fillAnswerDiv(document.getElementsByName("success_reasons")[tableNumber], activity.success_reasons);
	document.getElementsByName("is_seed")[tableNumber].innerHTML=(activity.is_seed==1)? "Seed" : "Sprout";
	fillAnswerDiv(document.getElementsByName("success_reasons")[tableNumber], activity.success_reasons);
	fillAnswerDiv(document.getElementsByName("waterboxx_condition")[tableNumber], activity.waterboxx_condition);
	fillAnswerDiv(document.getElementsByName("other_data")[tableNumber], activity.other_data);
	document.getElementsByName("activityImage")[tableNumber].src=GLOBALS.PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id;
	
}


// Is now also called from studentActivityList to create the list.
// Added isStudent parameter so that way the specifications that only need to be shown to teachers aren't shown to students.
function generateActivityView(activity, isStudent, tableNumber) {
	var activityTable = document.createElement('table');
	activityTable.innerHTML=GLOBALS.activityView;
	setTimeout(function(){fillActivityTable(activity, isStudent, tableNumber);}, 75);
	return activityTable;
}

// This generates the list of multiple choice answers, as well as the question
// and puts it in a table data cell
function generateMultipleChoiceList(question, answerList) {
	var cellData = document.createElement('td');
	cellData.colSpan = "2";
	var questionLabel = document.createElement('div');
	questionLabel.className = "questionLabel";
	questionLabel.innerHTML = "Multiple choice question:";
	var questionText = document.createElement('span');
	questionText.className = "multipleChoiceQuestionText";
	if (question != "") {
		questionText.innerHTML = question;
	}
	else {
		questionText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		questionText.className = "unansweredQuestion";
	}
	
	var orderedList = document.createElement('ol');
	orderedList.className = "multipleChoiceAnswers";
	
	for (var i = 0; i < answerList.choices.length; i++) {
		var answer = document.createElement('li');
		if (answerList.choices[i].ans == "true") { // style correct answer
			var answerSpan = document.createElement('span');
			answerSpan.className = "correctAnswer";
			answerSpan.innerHTML = answerList.choices[i].content;
			answer.appendChild(answerSpan);
		}
		else {
			answer.innerHTML = answerList.choices[i].content;
		}
		orderedList.appendChild(answer);
	}
	
	cellData.appendChild(questionLabel);
	cellData.appendChild(questionText);
	cellData.appendChild(orderedList);
	return cellData;
}

var huntboundary;
// This is the function that is going to be called when a teacher clicks on the edit button for an activity.
// Changes the view of that specific activity to the teacher edit view.
function addTeacherComments(activityTable, editButton, activity_id){
	var textView=document.createElement("textarea");
	textView.innerHTML=activityTable.childNodes[2].childNodes[1].innerHTML;
	activityTable.childNodes[2].childNodes[1].innerHTML="";
	activityTable.childNodes[2].childNodes[1].appendChild(textView);
	var select=document.createElement("select");
	// TODO: Move this to the constants.json file.
	var options=["Verified", "Unverified", "Incomplete", "New"];
	for(var i=0; i<options.length; i++){
		select.options[i]=new Option(options[i], options[i]);
	}
	select.value=activityTable.childNodes[2].childNodes[3].innerHTML;
	activityTable.childNodes[2].childNodes[3].innerHTML="";
	activityTable.childNodes[2].childNodes[3].appendChild(select);
	editButton.onclick=function(){submitTeacherComments(activityTable, activity_id);};
	editButton.value="Submit Comments";
}

function submitTeacherComments(activityTable, activity_id){
	var comment=activityTable.childNodes[2].childNodes[1].childNodes[0].value;
	var status=activityTable.childNodes[2].childNodes[3].childNodes[0].value;
	var content="comments=" + comment;
	content+="&status=" + status;
	content+="&id=" + activity_id;
	ajax(content, PHP_FOLDER_LOCATION + "teacher_upload.php", function(){successfulCommentUpdate(activity_id, comment, status)});
}


function successfulCommentUpdate(activity_id, comment, status){
	sid=document.getElementById("slist").value;
	var activitiesNumber;
	for(var i=0; i<activities.length; i++){
		if(activities[i].sid==sid){
		activitiesNumber=i;
		break;
		}
	}
	document.getElementById("activity").innerHTML="";
	for ( var i = 0; i < activities[activitiesNumber].contents.length; i++) {
		if(activities[activitiesNumber].contents[i].id==activity_id){
			activities[activitiesNumber].contents[i].comments=comment;
			activities[activitiesNumber].contents[i].status=status;
		}
		$('activity').appendChild(generateActivityView(activities[activitiesNumber].contents[i], false));
	}
	activityTable.childNodes[2].childNodes[1].innerHTML=comment;
	activityTable.childNodes[2].childNodes[3].innerHTML=status;
}

function editActivityAsStudent(activity) {
	// Before storing into the session storage, make sure that it exists.
	if(typeof(Storage)!=="undefined"){
		sessionStorage.activity=JSON.stringify(activity);
		sessionStorage.isEdit=true;
	} else{
		// TODO:  What do we want to do if they can't store into local storage?
	}
	
	
	// multiple gets initialized in wscript_init.  It's supposed to be multiple.htm.
	$('activity').innerHTML = multiple;
	// Ugly onsubmit, but only way I know of passing a parameter onsubmit.
	document.getElementsByName("multiple")[0].onsubmit = function() {
		submitEdit(activity['id']); return false;
	};
	// Adds the image that was already uploaded to the edit page.
	document.getElementById("activityImage").src = PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id;
	
	//Loop through all of the nodes in activity, and if a node exists for it, set it.
	for(var element in activity){
		if(document.getElementsByName(element)[0]!=null){
			if(document.getElementsByName(element)[0].type=="select-one")
			{
				document.getElementsByName(element)[0].selectedIndex=activity[element];
			}
			// if this is a date (aka text) field and it is set to the 1969/null date, don't display it.
			else if(document.getElementsByName(element)[0].type=="text" && activity[element] == "1969-12-31")
			{
				activity[element] = "";
				document.getElementsByName(element)[0].value=activity[element];
			}
			else
			{
				document.getElementsByName(element)[0].value=activity[element];
			}
		}
	}
	
	
	// Sets up huntboundary in order so when a new image is uploaded, they can plot the location on the map.
	var hunt;
	for (var i=0; i<hunts.length; i++) {
		if (hunts[i]['id'] == document.getElementById("selecthunt").value) {
			hunt=hunts[i];
		}
	}

	huntboundary = new google.maps.LatLngBounds(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLng(hunt['maxlat'],hunt['maxlng']));

}

function submitEdit(id) {
	var form = document.getElementsByName('multiple')[0];
	var x = document.getElementsByName('answer');
	var contents = {};
	var inputTypes=new Array("textarea","number", "select-one");
	for(var i = 0; i < form.length; i++) {
		if (inputTypes.indexOf(form[i].type)!=-1)
		{
			contents[form[i].name] = form[i].value;
		}
		else if(form[i].type=="text" || form[i].type=="date") // note that 'date' input fields are actually of type 'text'
		{
			// Javascript uses milliseconds where as unix uses whole seconds, so divide by 1000 so we can use MYSQL's build in UNIX_TIME converter.
			// Every date I was posting was being added to the server as a day before what I set it to, so I add 86400 to seconds to add a day.

			var epoch_time_s=(Date.parse(form[i].value)/1000)+86400;
			// if the form has null value, the above will be NaN
			if (isNaN(epoch_time_s))
			{
				epoch_time_s = 0; // Note that 0 in this context == "1969-12-31"
			}
			contents[form[i].name]=epoch_time_s;
		}
	}
	if (morc && morc.verify()) {
		var mediaContents={};
			mediaContents.media=morc;
			mediaContents.lat=morc.loc.lat();
			mediaContents.lng=morc.loc.lng();
			mediaContents.id=id;
			mediaContents=JSON.stringify(mediaContents);
			ajax("content="+mediaContents, PHP_FOLDER_LOCATION + "updateImage.php", function(serverResponse){ console.log(serverResponse);});
		} 
			contents['huntid'] = document.getElementById("selecthunt").value;
			contents.id=id;
			// Checks to make sure that all of the required attribute are filled in.
			if(contents.partner_names && contents.date_planted && contents.date_observed && contents.successful && contents.height && contents.site_description && contents.is_seed && contents.success_reasons && contents.waterboxx_condition && contents.other_data){
				contents.status="Unverified";
			} else{
				contents.status="Incomplete";
			}
		contents=JSON.stringify(contents);
	ajax("contents="+contents, PHP_FOLDER_LOCATION + "updateActivity.php", successfulUpload);
}

function successfulUpload(serverResponse){
	if (serverResponse=="true") {
		window.location.reload();
	}
	else {
		alert(serverResponse);
	}
}

function activityStatus(comments,x)
{
	if(feed[x] == undefined) return;
	var status = document.createElement('select');
	status.options[status.options.length] = new Option("ACCEPT", "true");
	status.options[status.options.length] = new Option("DECLINE", "false");
	status.onchange = function() {
		if (this.value == "false") {
			this.parentNode.insertBefore(comments, this.nextSibling);
			feed[x].grant = "false";
		} else {
			this.parentNode.removeChild(comments);
			feed[x].grant = 'true';
			feed[x].comment = '';
		}
	};
	status.value = feed[x].grant;
	if (status.value == "false") {
		comments.childNodes[1].value = feed[x].comment;
		status.parentNode.insertBefore(comments, status.nextSibling);
	}
	return status;
}

// don't really need this as a separate function....
function clear()
{
	var clear = createElement('div', '');
	clear.className = 'clear';
	return clear;
}
//
function handleupload(x) {
	if (x == "unexpectedrequest")
		alert("Something went wrong while uploading Data");
	else if (x == "mysqlfailed")
		alert("Mysql Failed with Error");
	else if (x == "sucess")
		alert("Data sucessfully Updated");
}
