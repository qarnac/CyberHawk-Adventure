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
		activities = [];
		activityList = JSON.parse(allActivities);

		var studentList = listbox();
		feedactivity(activityList, studentList);
		$('students').appendChild(studentList);
//		$('students').appendChild(updatebutton());
		//actdisp(allActivities[m]);
	}
}

// I wonder if it would be better to only fetch student activities
// once the student has been selected, instead of all students at the same time.
function feedactivity(x, list_box) {
	for ( m = 0; m < x.length; m++) {
		var z;
		if (activities.hassid(x[m]['student_id']) == 'false') {
			z = new Object();
			z.sid = x[m]['student_id'];
			z.contents = new Array();
			z.contents.push(x[m]);
			activities.push(z);
			// couldn't this just be replaced with .add() ?
			list_box.addoption("View Student Activities", x[m]['student_id']);
		} else {
			z = activities.hassid(x[m]['student_id']);
			activities[z].contents.push(x[m]);
		}
		z = new Object();
		z.grant = "true";
		z.comment = '';
		feed[x[m]['id']] = z;
	}
}

function updatebutton() {
	var temp = document.createElement('input');
	temp.type = 'button';
	temp.value = "Update DB";
	//When this button is clicked the feed array is sent to the server
	temp.onclick = function() {
		ajax('content=' + JSON.stringify(feed), PHP_FOLDER_LOCATION + 'upload.php', handleupload);
	};
	return temp;
}

// This is the listbox which houses each teacher's students.
function listbox() {
	var temp = document.createElement('select');
	temp.id = 'slist';
	temp.size = 20;
	temp.multiple = 'multiple';
	// couldn't this just be replaced with .add() ?
	temp.addoption = function(label, value) {
		this.options[this.options.length] = new Option(label, value);
	};
	temp.onchange = function() {
		$('activity').innerHTML = "";
		var x = activities.hassid(this.value);
		if (x == "false") {
			// Only happens when a user is selected, and then unselected (via shift-click)
		}
		else {
			for ( var i = 0; i < activities[x].contents.length; i++) {
				$('activity').appendChild(generateActivityView(activities[x].contents[i], false));
			}
		}
	};
	return temp;
}

// Is now also called from studentActivityList to create the list.
// Added isStudent parameter so that way the specifications that only need to be shown to teachers aren't shown to students.
function generateActivityView(activity, isStudent) {
	// Add the Edit activity button first, so that it displays just to the right of the Activity View
	var editButton = document.createElement("input");
	editButton.setAttribute("type", "button");
	editButton.setAttribute("value", "Edit Activity");
	$('activity').appendChild(editButton);
	
	var activityTable = document.createElement('table');
	activityTable.className = "activityTable";
	activityTable.cellPadding = "5px";

	var activityTableRow1 = document.createElement('tr');
	var activityTableRow2 = document.createElement('tr');
	var activityTableRow3 = document.createElement('tr');
	
	var activityPhoto = document.createElement('img');
	activityPhoto.src = PHP_FOLDER_LOCATION + "image.php?id=" + activity['media_id'];
	
	var activityPhotoCell = document.createElement('td');
	activityPhotoCell.className = "activityPhotoCell";
	activityPhotoCell.appendChild(activityPhoto);

	var partnersLabel = document.createElement('div');
	partnersLabel.innerHTML = "List all the partners for this Waterboxx";
	partnersLabel.className = "questionLabel";
	var date_planted_label = document.createElement('div');
	date_planted_label.innerHTML = "What date was this planted?";
	date_planted_label.className = "questionLabel";
	var date_observed_label = document.createElement('div');
	date_observed_label.innerHTML = "What date did you observe it?";
	date_observed_label.className = "questionLabel";
	var successful_label = document.createElement('div');
	successful_label.innerHTML = "Was the planting successful?";
	successful_label.className = "questionLabel";
	var height_label = document.createElement('div');
	height_label.innerHTML = "If planting was successful, how tall was the plant (in cm)?";
	height_label.className = "questionLabel";
	var site_description_label = document.createElement('div');
	site_description_label.innerHTML = "Planting site description:";
	site_description_label.className = "questionLabel";
	var is_seed_label = document.createElement('div');
	is_seed_label.innerHTML = "Did you plant a sprout or a seed?";
	is_seed_label.className = "questionLabel";
	var success_reason_label = document.createElement('div');
	success_reason_label.innerHTML = "Why do you think you were (un)successful?";
	success_reason_label.className = "questionLabel";
	var waterboxx_condition_label = document.createElement('div');
	waterboxx_condition_label.innerHTML = "Current Waterboxx condition-amount of water: ";
	waterboxx_condition_label.className = "questionLabel";
	var other_label = document.createElement('div');
	other_label.innerHTML = "Other Observations:";
	other_label.className = "questionLabel";
	
	
	var aboutPhotoText = document.createElement('div');
	aboutPhotoText.innerHTML = activity['partner_names'];
	if (activity['partner_names'] == "") {
		aboutPhotoText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		aboutPhotoText.className = "unansweredQuestion";
	}

	var whyThisPhotoText = document.createElement('div');
	whyThisPhotoText.innerHTML = activity['date_planted'];
	if (activity['date_planted'] == "0000-00-00") {
		whyThisPhotoText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		whyThisPhotoText.className = "unansweredQuestion";
	}

	var howHelpfulText = document.createElement('div');
	howHelpfulText.innerHTML = activity['date_observed'];
	if (activity['date_observed'] == "0000-00-00") {
		howHelpfulText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		howHelpfulText.className = "unansweredQuestion";
	}

	var furtherQuestionText = document.createElement('div');
	furtherQuestionText.innerHTML = activity['successful'];
	if (activity['successful'] == true) {
		furtherQuestionText.innerHTML = "Yes";
	} else { furtherQuestionText.innerHTML= "No"; }
	
	var heightText = document.createElement('div');
	heightText.innerHTML = activity['height'];
	if (activity['height'] == 0) {
		heightText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		heightText.className = "unansweredQuestion";
	}
	
	var site_descriptionText = document.createElement('div');
	site_descriptionText.innerHTML = activity['site_description'];
	if (activity['site_description'] == "") {
		site_descriptionText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		site_descriptionText.className = "unansweredQuestion";
	}
	
	var is_seedText = document.createElement('div');
	if (activity['is_seed'] == 0)
	{
		is_seedText.innerHTML = "Sprout";
	}
	else if (activity['is_seed'] == 1)
	{
		is_seedText.innerHTML = "Seed";
	}
	
	var success_reasonsText = document.createElement('div');
	success_reasonsText.innerHTML = activity['success_reasons'];
	if (activity['success_reasons'] == "") {
		success_reasonsText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		success_reasonsText.className = "unansweredQuestion";
	}
	var waterboxx_conditionText = document.createElement('div');
	waterboxx_conditionText.innerHTML = activity['waterboxx_condition'];
	if (activity['waterboxx_condition'] == "") {
		waterboxx_conditionText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		waterboxx_conditionText.className = "unansweredQuestion";
	}
	
	var other_dataText = document.createElement('div');
	other_dataText.innerHTML = activity['other_data'];
	if (activity['other_data'] == "") {
		other_dataText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		other_dataText.className = "unansweredQuestion";
	}
	
	
	
	

	var commentLabel = document.createElement('div');
	commentLabel.innerHTML = "Teacher comments:";
	commentLabel.className = "questionLabel";
	
	var teacherCommentText=document.createElement("div");
	if (activity['comments'] == "") {
		teacherCommentText.innerHTML = GLOBALS.EMPTY_QUESTION_RESPONSE;
		teacherCommentText.className = "unansweredQuestion";
	}
	else
	{
		teacherCommentText.innerHTML=activity["comments"];
	}
	
	var activityStatusLabel = document.createElement('div');
	activityStatusLabel.innerHTML = "Activity Status:";
	activityStatusLabel.className = "questionLabel";
	
	var activityStatus=document.createElement("div");
	activityStatus.innerHTML=activity["status"];

	var aboutPhotoCell = document.createElement('td');
	aboutPhotoCell.className = "aboutPhotoCell";
	aboutPhotoCell.appendChild(partnersLabel);
	aboutPhotoCell.appendChild(aboutPhotoText);
	aboutPhotoCell.appendChild(date_planted_label);
	aboutPhotoCell.appendChild(whyThisPhotoText);
	aboutPhotoCell.appendChild(date_observed_label);
	aboutPhotoCell.appendChild(howHelpfulText);
	aboutPhotoCell.appendChild(successful_label);
	aboutPhotoCell.appendChild(furtherQuestionText);
	aboutPhotoCell.appendChild(height_label);
	aboutPhotoCell.appendChild(heightText);
	aboutPhotoCell.appendChild(site_description_label);
	aboutPhotoCell.appendChild(site_descriptionText);
	aboutPhotoCell.appendChild(is_seed_label);
	aboutPhotoCell.appendChild(is_seedText);
	aboutPhotoCell.appendChild(success_reason_label);
	aboutPhotoCell.appendChild(success_reasonsText);
	aboutPhotoCell.appendChild(waterboxx_condition_label);
	aboutPhotoCell.appendChild(waterboxx_conditionText);
	aboutPhotoCell.appendChild(other_label);
	aboutPhotoCell.appendChild(other_dataText);
	
	
	activityTableRow1.appendChild(activityPhotoCell);
	activityTableRow1.appendChild(aboutPhotoCell);
		
//	var multipleChoiceCell = generateMultipleChoiceList(activity['mquestion'], JSON.parse(activity['choices']));

//	activityTableRow2.appendChild(multipleChoiceCell);
	

	activityTableRow3.appendChild(commentLabel);
	activityTableRow3.appendChild(teacherCommentText);
	activityTableRow3.appendChild(activityStatusLabel);
	activityTableRow3.appendChild(activityStatus);
	
	activityTable.appendChild(activityTableRow1);
	activityTable.appendChild(activityTableRow2);
	activityTable.appendChild(activityTableRow3);
	
	var tableItem = document.createElement('li');
	tableItem.className = "activityItem";
	tableItem.appendChild(activityTable);
	
	if(isStudent) editButton.onclick = function() {editActivityAsStudent(activity);};
	else editButton.onclick=function(){addTeacherComments(activityTable, editButton, activity['id']);};
	
	return tableItem;
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
	// multiple gets initialized in wscript_init.  It's supposed to be multiple.htm.
	$('activity').innerHTML = multiple;
	choices = JSON.parse(activity.choices);
	// Ugly onsubmit, but only way I know of passing a parameter onsubmit.
	document.getElementsByName("multiple")[0].onsubmit = function() {
		submitEdit(activity['id']); return false;
	};
	// Adds the image that was already uploaded to the edit page.
	document.getElementById("activityImage").src = PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id;
	
	// At some point in time, we need to redo the way choices is encoded.  There is no reason the following line should be needed.
	choices=choices.choices;
	// Sets up the non-multiple choice questions.
	document.getElementsByName("aboutmedia")[0].innerHTML = activity.aboutmedia;
	document.getElementsByName("whythis")[0].innerHTML = activity.whythis;
	document.getElementsByName("howhelpful")[0].innerHTML = activity.howhelpfull;
	document.getElementsByName("yourdoubt")[0].innerHTML = activity.yourdoubt;
	document.getElementsByName("mquestion")[0].innerHTML = activity.mquestion;
	// Selects the correct Radio Button for the multiple choice questions.
	for(var i=0; i<choices.length; i++) {
		if (choices[i].ans == "true") {
			document.getElementsByName("answer")[i].checked = true;
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
	
	// Fill the multiple choice questions with the correct answers.
	document.getElementsByName("a")[0].value = choices[0].content;
	document.getElementsByName("b")[0].value = choices[1].content;
	document.getElementsByName("c")[0].value = choices[2].content;
	document.getElementsByName("d")[0].value = choices[3].content;
	document.getElementsByName("e")[0].value = choices[4].content;
}

function submitEdit(id) {
	console.log("submit");
	var form = document.getElementsByName('multiple')[0];
	var x = document.getElementsByName('answer');
	var contents = {};
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			contents['answer'] = x[i].value;
			break;
			}
		}
		var y=new Array("textarea","text","number");
		for (var i=0; i<form.length; i++) {
			if (y.indexOf(form[i].type)!=-1) {
				contents[form[i].name] = form[i].value;
			}
		}
		contents['id']=id;
		if (morc && morc.verify()) {
			contents['media'] = morc;
		}
		// Checks to make sure that all of the required attribute are filled in.
		if(contents.aboutmedia && contents.a && contents.b && contents.howhelpful && contents.mquestion && contents.whythis && contents.yourdoubt){
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

function feedback(x)
{
	var div = createElement('div','');
	var comments = createElement('div','');
	var label = createElement('label', 'Comments');
	label.style.width = '80px';
	var textarea = document.createElement('textarea');
	textarea.onchange = function() {
		feed[x['id']].comment = this.value;
	}
	comments.appendChild(label);
	comments.appendChild(textarea);
	div.appendChild(activityStatus(comments,x));
	return div;
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
