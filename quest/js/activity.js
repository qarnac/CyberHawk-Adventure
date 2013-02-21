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
	else{
		activities = [];
		activityList = JSON.parse(allActivities);
		var studentList = listbox(activityList);
		feedactivity(activityList, studentList);
		$('students').appendChild(studentList);
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

// This is the listbox which houses each teacher's students.
function listbox(activityList) {
	var temp = document.createElement('select');
	temp.id = 'slist';
	temp.size = 20;
	temp.style.display="none";
	temp.multiple = 'multiple';
	// couldn't this just be replaced with .add() ?
	temp.addoption = function(label, value) {
		this.options[this.options.length] = new Option(label, value);
	};
	temp.onchange = function() {
		$('activity').innerHTML = "";
		student_id=this.value;
		var x = activities.hassid(student_id);
		if (x == "false") {
			// Only happens when a user is selected, and then unselected (via shift-click)
		}
		else {
			var tableNumber=0;
			for ( var i = 0; i < activityList.length; i++) {
					if(activityList[i].student_id!=student_id) continue;
					$('activity').appendChild(generateActivityView(activityList[i], false, tableNumber++));
					}
			}
	};
	return temp;
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
// isStudent is now getting changed from a boolean value.  The reasoning is that with the public view,
// we have more than two different tables we want to display with this same format.
// Due to this, isStudent can now contain the following values:
// isStudent==0==false, teacher view.
// isStudent==1==true, student view.
// isStudent==2, public view.
// TODO: Create an enum for the integer values of isStudent to help grant more clarity when checking isStudent.
function fillActivityTable(activity, isStudent, tableNumber){
	// Take care of the special cases for the private view.
	if(isStudent!=2){
		fillAnswerDiv(document.getElementsByName("partner_names")[tableNumber], activity.partner_names);
		document.getElementsByName("comments")[tableNumber].innerHTML=activity.comments;
		document.getElementsByName("status")[tableNumber].innerHTML=activity.status;
		// Sets up the multiple choice display.
		var orderedList = document.getElementsByName("manswers")[tableNumber];
		orderedList.className = "multipleChoiceAnswers";
		var answerList=JSON.parse(activity.choices);
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
		// Else we have to take care of the special cases for public view.
	} else{
		var choices=JSON.parse(activity.choices).choices;
		if(choices[0]!= undefined){
			document.getElementById("answer1").innerHTML=choices[0].content;
			document.getElementsByName("mchoice")[tableNumber*4].onclick=function(){radioSelect(document.getElementById("q0"), document.getElementById("answer1"), choices[0].ans!="false");};
		} else{ document.getElementById("q0").style.display="none"; }
		if(choices[1]!=undefined){
			document.getElementById("answer2").innerHTML=choices[1].content;
			document.getElementsByName("mchoice")[tableNumber*4+1].onclick=function(){radioSelect(document.getElementById("q1"), document.getElementById("answer2"),choices[1].ans!="false");};
		} else{ document.getElementById("q1").style.display="none"; }
		if(choices[2]!=undefined){
			document.getElementById("answer3").innerHTML=choices[2].content;
			document.getElementsByName("mchoice")[tableNumber*4+2].onclick=function(){radioSelect(document.getElementById("q2"), document.getElementById("answer3"), choices[2].ans!="false")};
		} else{ document.getElementById("q2").style.display="none"; }
		if(choices[3]!=undefined){
			document.getElementById("answer4").innerHTML=choices[3].content;
			document.getElementsByName("mchoice")[tableNumber*4+3].onclick=function(){radioSelect(document.getElementById("q3"), document.getElementById("answer4"), choices[3].ans!="false");};
		} else{ document.getElementById("q3").style.display="none"; }
	}
	// Everything else is the same for both views.
	fillAnswerDiv(document.getElementsByName("aboutmedia")[tableNumber],activity.aboutmedia);
	// Question removed on 2/21/2013.
	//fillAnswerDiv(document.getElementsByName("whythis")[tableNumber], activity.whythis);
	fillAnswerDiv(document.getElementsByName("howhelpfull")[tableNumber], activity.howhelpfull);
	fillAnswerDiv(document.getElementsByName("yourdoubt")[tableNumber], activity.yourdoubt);
	fillAnswerDiv(document.getElementsByName("mquestion")[tableNumber], activity.mquestion);
	document.getElementsByName("activityImage")[tableNumber].src= GLOBALS.PHP_FOLDER_LOCATION + "image.php?id=" + activity.media_id;
	if(isStudent==2){
		document.getElementsByName("optionalQuestion1")[tableNumber].style.display="none";
		document.getElementsByName("optionalAnswer1")[tableNumber].style.display="none";
		document.getElementsByName("optionalQuestion2")[tableNumber].style.display="none";
		document.getElementsByName("optionalAnswer2")[tableNumber].style.display="none";
		document.getElementsByName("optionalQuestion3")[tableNumber].style.display="none";
		document.getElementsByName("optionalAnswer3")[tableNumber].style.display="none";
	}else {
		var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(activity.hunt_id)];
		if(hunt.additionalQuestions==undefined || hunt.additionalQuestions==""){
			document.getElementsByName("optionalQuestion1")[tableNumber].style.display="none";
			document.getElementsByName("optionalAnswer1")[tableNumber].style.display="none";
			document.getElementsByName("optionalQuestion2")[tableNumber].style.display="none";
			document.getElementsByName("optionalAnswer2")[tableNumber].style.display="none";
			document.getElementsByName("optionalQuestion3")[tableNumber].style.display="none";
			document.getElementsByName("optionalAnswer3")[tableNumber].style.display="none";
		} else{
			// If the student answered answered the additional questions, parse the answers.
			// Otherwise just leave the variable blank (but still initialize)
			if(activity.additionalQuestions) var additionalAnswers=JSON.parse(activity.additionalQuestions);
			else var additionalAnswers={a:"",b:"",c:""};
			// Parse the questions from the hunt.
			var additionalQuestions=JSON.parse(hunt.additionalQuestions);
			
			// Fill in the Divs with the questions and answers (only if they exist).
			if(additionalQuestions.questiona){
				document.getElementsByName("optionalQuestion1")[tableNumber].innerHTML=additionalQuestions.questiona;
				fillAnswerDiv(document.getElementsByName("optionalAnswer1")[tableNumber], additionalAnswers.a);
			}
			if(additionalQuestions.questionb){
				document.getElementsByName("optionalQuestion2")[tableNumber].innerHTML=additionalQuestions.questionb;
				fillAnswerDiv(document.getElementsByName("optionalAnswer2")[tableNumber], additionalAnswers.b);
			}
			if(additionalQuestions.questionc){
				document.getElementsByName("optionalQuestion3")[tableNumber].innerHTML=additionalQuestions.questionc;
				fillAnswerDiv(document.getElementsByName("optionalAnswer3")[tableNumber], additionalAnswers.c);
			}
		} // end of dealing with additional questions.
	}

	if(isStudent==1){
		document.getElementsByName("editButton")[tableNumber].onclick=function(){editActivityAsStudent(activity);};
	} else if(activity.status!="incomplete" && isStudent!=2){
		document.getElementsByName("editButton")[tableNumber].onclick=function(){ addTeacherComments(document.getElementsByName("editButton")[tableNumber].parentNode,
																									document.getElementsByName("editButton")[tableNumber],
																									activity.id);};
	}else{
		if(isStudent!=2) document.getElementsByName("editButton")[tableNumber].style.display="none";
	}
}

// This is the function that is called when a radio button is clicked in the public view.
// Changes the view of the button and the label, changing whether they answered correctly or incorrectly.
function radioSelect(button, label, isCorrect){
		// Hide the original button, and then display the checkmark to indicate they answered correctly.
		button.style.display="none";
		var img=document.createElement("img");
		if(isCorrect) img.src=GLOBALS.HTML_FOLDER_LOCATION + "apply.png";
		else img.src=GLOBALS.HTML_FOLDER_LOCATION + "delete.png";
		// We have to specify the parent div for the label that we want to insert before in.
		document.getElementById("mcForm").insertBefore(img, label);

}


// Is now also called from studentActivityList to create the list.
// Added isStudent parameter so that way the specifications that only need to be shown to teachers aren't shown to students.
function generateActivityView(activity, isStudent, tableNumber) {
	var activityTable = document.createElement('table');
	if(isStudent==2) activityTable.innerHTML=GLOBALS.publicActivityView;
	else activityTable.innerHTML=GLOBALS.activityView;
	setTimeout(function(){fillActivityTable(activity, isStudent, tableNumber);}, 500);
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
	document.getElementsByName("partner_names")[0].innerHTML = activity.partner_names;
	document.getElementsByName("aboutmedia")[0].innerHTML = activity.aboutmedia;
	// Question removed on 2/21/2013
//	document.getElementsByName("whythis")[0].innerHTML = activity.whythis;
	document.getElementsByName("howhelpful")[0].innerHTML = activity.howhelpfull;
	document.getElementsByName("yourdoubt")[0].innerHTML = activity.yourdoubt;
	document.getElementsByName("mquestion")[0].innerHTML = activity.mquestion;
	
	for(var i=0; i<document.getElementById("selecthunt").options.length; i++){
		if(document.getElementById("selecthunt").options[i].value==activity.hunt_id){
			optionNumber=i-1;
			break;
		}
	}
	// Sets up whether or not to display additional questions.
	displayAdditionalQuestions(activity.additionalQuestions);
	
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
			var mediaContents={};
			mediaContents.media=morc;
			mediaContents.lat=morc.loc.lat();
			mediaContents.lng=morc.loc.lng();
			mediaContents.id=id;
			mediaContents=JSON.stringify(mediaContents);
			ajax("content="+mediaContents, PHP_FOLDER_LOCATION + "updateImage.php", function(serverResponse){ console.log(serverResponse);});
		} else if(sessionStorage.lat && sessionStorage.lng){
			var mediaContents={};
			mediaContents.lat=sessionStorage.lat;
			mediaContents.lng=sessionStorage.lng;
			mediaContents.id=id;
			mediaContents=JSON.stringify(mediaContents);
			ajax("content=" + mediaContents, PHP_FOLDER_LOCATION + "updateImage.php", function(serverResponse){console.log(serverResponse);});
		}
		// Checks to make sure that all of the required attribute are filled in.
		if(contents.aboutmedia && contents.a && contents.b && contents.howhelpful && contents.mquestion && contents.yourdoubt){
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


// This function is used to determine whether or not the additional questions from activityView.html should be displayed.
// If the questions exist for the selected hunt, it fills it in, and fills in the answers using the parameter passed into this function.
// If the questions do not exist, it just makes the divs that would display the additional questions and answers not displayed.
function displayAdditionalQuestions(additionalAnswers){
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)];
	// If the hunt has no additional questions, go ahead and make none of the additional questions or answers display.
	if(hunt.additionalQuestions==undefined || hunt.additionalQuestions==""){
		document.getElementsByName("optionalQuestion1")[0].style.display="none";
		document.getElementsByName("optionalAnswer1")[0].style.display="none";
		document.getElementsByName("optionalQuestion2")[0].style.display="none";
		document.getElementsByName("optionalAnswer2")[0].style.display="none";
		document.getElementsByName("optionalQuestion3")[0].style.display="none";
		document.getElementsByName("optionalAnswer3")[0].style.display="none";
		// Otherwise, this means that additional questions do exist for the hunt, and so we want to fill in the divs.
	} else{
		// Parse the questions.
		var additionalQuestions=JSON.parse(hunt.additionalQuestions);
		// Make sure that additionalAnswers wasn't left blank in the database. If it was blank, just leave the answers blank, but still fill in questions..
		if(additionalAnswers==undefined || additionalAnswers=="") additionalAnswers={answera:"",answerb:"",answerc:""};
		else additionalAnswers=JSON.parse(additionalAnswers);
		
		// Check that the question exists.  If it does, fill in the question and the answer.
		// If not, make the q/a not displayed.
		if(additionalQuestions.questiona){
			// We just want to add the string to the start of the HTML, not delete what was already there.
			document.getElementsByName("optionalQuestion1")[0].innerHTML=additionalQuestions.questiona + document.getElementsByName("optionalQuestion1")[0].innerHTML;
			document.getElementsByName("optionalAnswer1")[0].innerHTML=additionalAnswers.answera;
		} else{
			document.getElementsByName("optionalQuestion1")[0].style.display="none";
			document.getElementsByName("optionalAnswer1")[0].style.display="none"
		}
		// Fill in the second question.
		if(additionalQuestions.questionb){
			document.getElementsByName("optionalQuestion2")[0].innerHTML=additionalQuestions.questionb + document.getElementsByName("optionalQuestion2")[0].innerHTML;
			document.getElementsByName("optionalAnswer2")[0].innerHTML=additionalAnswers.answerb;
		} else{
			document.getElementsByName("optionalQuestion2")[0].style.display="none";
			document.getElementsByName("optionalAnswer2")[0].style.display="none";
		}
		
		// Fill in the third question.
		if(additionalQuestions.questionc){
			document.getElementsByName("optionalQuestion3")[0].innerHTML=additionalQuestions.questionc + document.getElementsByName("optionalQuestion3")[0].innerHTML;
			document.getElementsByName("optionalAnswer3")[0].innerHTML=additionalAnswers.answerc;
		} else{
			document.getElementsByName("optionalQuestion3")[0].style.display="none";
			document.getElementsByName("optionalAnswer3")[0].style.display="none";
		}
	}
	
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
