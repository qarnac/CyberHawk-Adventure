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

var EMPTY_QUESTION_RESPONSE = "This question has not been responded to.";


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
			list_box.addoption(x[m]['firstname'] + " " + x[m]['lastname'], x[m]['student_id']);
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
	if (isStudent == true) {
		var editButton = document.createElement("input");
		editButton.setAttribute("type", "button");
		editButton.setAttribute("value", "Edit Activity");
		// Use this ugly syntax because it's the only way I know of passing the parameter to an onclick function.
		editButton.onclick = function() {
			editActivity(activity);
		}
		$('activity').appendChild(editButton);
	}
	else {
		// feedback code goes here.
	}

	var activityTable = document.createElement('table');
	activityTable.className = "activityTable";
	activityTable.cellPadding = "5px";

	var activityTableRow1 = document.createElement('tr');
	var activityTableRow2 = document.createElement('tr');
	
	var activityPhoto = document.createElement('img');
	activityPhoto.src = PHP_FOLDER_LOCATION + "image.php?id=" + activity['media_id'];
	
	var activityPhotoCell = document.createElement('td');
	activityPhotoCell.className = "activityPhotoCell";
	activityPhotoCell.appendChild(activityPhoto);

	var aboutLabel = document.createElement('div');
	aboutLabel.innerHTML = "What is this picture about?";
	aboutLabel.className = "questionLabel";
	var whyLabel = document.createElement('div');
	whyLabel.innerHTML = "Why did you choose this picture";
	whyLabel.className = "questionLabel";
	var helpfulLabel = document.createElement('div');
	helpfulLabel.innerHTML = "How does this picture show what you've learned in class?";
	helpfulLabel.className = "questionLabel";
	var furtherLabel = document.createElement('div');
	furtherLabel.innerHTML = "What is a question you have about this picture?";
	furtherLabel.className = "questionLabel";
	
	var aboutPhotoText = document.createElement('div');
	aboutPhotoText.innerHTML = activity['aboutmedia'];
	if (activity['aboutmedia'] == "") {
		aboutPhotoText.innerHTML = EMPTY_QUESTION_RESPONSE;
		aboutPhotoText.className = "unansweredQuestion";
	}

	var whyThisPhotoText = document.createElement('div');
	whyThisPhotoText.innerHTML = activity['whythis'];
	if (activity['whythis'] == "") {
		whyThisPhotoText.innerHTML = EMPTY_QUESTION_RESPONSE;
		whyThisPhotoText.className = "unansweredQuestion";
	}

	var howHelpfulText = document.createElement('div');
	howHelpfulText.innerHTML = activity['howhelpfull'];
	if (activity['howhelpfull'] == "") {
		howHelpfulText.innerHTML = EMPTY_QUESTION_RESPONSE;
		howHelpfulText.className = "unansweredQuestion";
	}

	var furtherQuestionText = document.createElement('div');
	furtherQuestionText.innerHTML = activity['yourdoubt'];
	if (activity['yourdoubt'] == "") {
		furtherQuestionText.innerHTML = EMPTY_QUESTION_RESPONSE;
		furtherQuestionText.className = "unansweredQuestion";
	}
	
	var aboutPhotoCell = document.createElement('td');
	aboutPhotoCell.className = "aboutPhotoCell";
	aboutPhotoCell.appendChild(aboutLabel);
	aboutPhotoCell.appendChild(aboutPhotoText);
	aboutPhotoCell.appendChild(whyLabel);
	aboutPhotoCell.appendChild(whyThisPhotoText);
	aboutPhotoCell.appendChild(helpfulLabel);
	aboutPhotoCell.appendChild(howHelpfulText);
	aboutPhotoCell.appendChild(furtherLabel);
	aboutPhotoCell.appendChild(furtherQuestionText);

	activityTableRow1.appendChild(activityPhotoCell);
	activityTableRow1.appendChild(aboutPhotoCell);
		
	var multipleChoiceCell = generateMultipleChoiceList(activity['mquestion'], JSON.parse(activity['choices']));

	activityTableRow2.appendChild(multipleChoiceCell);
	
	activityTable.appendChild(activityTableRow1);
	activityTable.appendChild(activityTableRow2);
	
	var tableItem = document.createElement('li');
	tableItem.className = "activityItem";
	tableItem.appendChild(activityTable);
	
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
		questionText.innerHTML = EMPTY_QUESTION_RESPONSE;
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
function editActivity(activity) {
	// multiple gets initialized in wscript_init.  It's supposed to be multiple.htm.
	$('activity').innerHTML = multiple;
	choices = JSON.parse(activity.choices);
	// Ugly onsubmit, but only way I know of passing a parameter onsubmit.
	document.getElementsByName("multiple")[0].onsubmit = function() {
		submitEdit(activity['id']); return false;
	};
	// Adds the image that was already uploaded to the edit page.
	var img = document.createElement('img');
	img.src = PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id;
	
	document.getElementById("activityImage").appendChild(img);
	
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

	huntboundary = new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	
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
			if (y.has(form[i].type)) {
				contents[form[i].name] = form[i].value;
			}
		}
		contents['id']=id;
		if (morc && morc.verify()) {
			contents['media'] = morc;
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
