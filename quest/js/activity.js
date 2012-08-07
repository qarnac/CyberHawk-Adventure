/**
 * @author sabareesh kkanan subramani
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
			// Shouldn't happen.  Means user clicked on a name that is not in the listbox.
			alert("something went wrong in listbox()");
		}
		else {
			for ( var i = 0; i < activities[x].contents.length; i++) {
//				displayactivity(activities[x].contents[i], false);
				generateActivityView(activities[x].contents[i], false);
//				$('activity').appendChild('hr');
			}
		}
	};

	return temp;
}

function generateActivityView(activity, isStudent) {
	var activityTable = document.createElement('table');
	activityTable.className = "activityTable";
	
	var activityTableRow1 = document.createElement('tr');
	var activityTableRow2 = document.createElement('tr');
	var activityTableRow3 = document.createElement('tr');
	
	var studentName = document.createElement('td');
	studentName.className = "studentName";
	studentName.style.verticalAlign = "top";
	studentName.innerHTML = "<strong>Student:</strong> " + activity['firstname'] + " " + activity['lastname'];
	
	var activityPhotoCell = document.createElement('td');
	activityPhotoCell.className = "activityPhotoCell";
	activityPhotoCell.style.textAlign = "center";
	activityPhotoCell.appendChild(createimage(activity['media_id']));
	
	activityTableRow1.appendChild(studentName);
	activityTableRow1.appendChild(activityPhotoCell);
	
	var multipleChoiceCell = generateMultipleChoiceList(activity['mquestion'], JSON.parse(activity['choices']));

	var aboutPhotoText = document.createElement('div');
	aboutPhotoText.innerHTML = activity['aboutmedia'];
	var whyThisPhotoText = document.createElement('div');
	whyThisPhotoText.innerHTML = activity['whythis'];
	
	var aboutPhotoCell = document.createElement('td');
	aboutPhotoCell.appendChild(aboutPhotoText);
	aboutPhotoCell.appendChild(whyThisPhotoText);
	
	activityTableRow2.appendChild(multipleChoiceCell);
	activityTableRow2.appendChild(aboutPhotoCell);
	
	var howHelpfulText = document.createElement('div');
	howHelpfulText.innerHTML = activity['howhelpfull'];
	var furtherQuestionText = document.createElement('div');
	furtherQuestionText.innerHTML = activity['yourdoubt'];
	
	activityTableRow3.appendChild(howHelpfulText);
	activityTableRow3.appendChild(furtherQuestionText);
	
	activityTable.appendChild(activityTableRow1);
	activityTable.appendChild(activityTableRow2);
	activityTable.appendChild(activityTableRow3);
	
	$('activity').appendChild(activityTable);
}

// This generates the list of multiple choice answers, as well as the quetsion
// and puts it in a table data cell
function generateMultipleChoiceList(question, answerList) {
	var cellData = document.createElement('td');
	var questionText = document.createElement('span');
	questionText.className = "multipleChoiceQuestionText";
	questionText.innerHTML = question;
	
	var orderedList = document.createElement('ol');
	orderedList.className = "multipleChoiceAnswers";
	orderedList.style.listStyleType = "lower-alpha";
	
	for (var i = 0; i < answerList.choices.length; i++) {
		var answer = document.createElement('li');

		if (answerList.choices[i].ans == "true") { // style correct answer
			var answerSpan = document.createElement('span');
			answerSpan.className = "correctAnswer";
			answerSpan.style.color = "green";
			answerSpan.style.borderBottomColor = "green";
			answerSpan.style.borderBottomStyle = "dotted"
			answerSpan.innerHTML = answerList.choices[i].content;
			answer.appendChild(answerSpan);
		}
		else {
			answer.innerHTML = answerList.choices[i].content;
		}
		orderedList.appendChild(answer);
	}
	
	cellData.appendChild(questionText);
	cellData.appendChild(orderedList);
	return cellData;
}

//displays the activity
// Is now also called from studentActivityList to create the list.
// Added isStudent parameter so that way the specifications that only need to be shown to teachers aren't shown to students.
function displayactivity(activity, isStudent) {
	var div = document.createElement('div');
	div.className = 'elem';

	//Image Element
	div.appendChild(createimage(activity['media_id']));
	div.appendChild(clear());

	//USER Name elements ,Multiple choice question Elements
	div.appendChild(createElement('label', "<strong>Student:</strong> " + activity['firstname'] + " " + activity['lastname']));
	div.appendChild(multiplechoice(activity['mquestion'], JSON.parse(activity['choices'])));
	div.appendChild(clear());

	//Other Question Elements
	div.appendChild(otherquestions(activity));
	div.appendChild(clear());

	//Comments and status Elements ad their Eventhandling on onchange to update the variable feed
	if(!isStudent) div.appendChild(feedback(activity['id']));
	div.appendChild(clear());

	//Horizontal Ruler
	div.appendChild(createElement('hr',''));

	//Append the div element to the div 'activity'
	$('activity').appendChild(div);
}

function multiplechoice(question, ans)
{
	var div = createElement('div', '');
	var mchoice = createElement('label',question);
	mchoice.style.width = '550px';
	div.appendChild(mchoice);
	div.appendChild(clear());
	for ( y = 0; y < ans.choices.length; y++)
		if (ans.choices[y].ans == "true") {
			var temp = createElement('label', ans.choices[y].choice + ". " + ans.choices[y].content);
			temp.style.color = "green";
			temp.style.borderBottomStyle = "dashed";
			temp.style.borderBottomColor = "green";
			div.appendChild(temp);
		} else
			div.appendChild(createElement('label', ans.choices[y].choice + ". " + ans.choices[y].content));
	return div;
}

function otherquestions(x)
{
	var div=createElement('div', '');
	// HTML ignores duplicate whitespace...
	div.appendChild(createElement('label', 'About    : ' + x['aboutmedia']));
	div.appendChild(createElement('label', 'Reason   : ' + x['whythis']));
	div.appendChild(createElement('label', 'Evidence : ' + x['howhelpfull']));
	div.appendChild(createElement('label', 'Question : ' + x['yourdoubt']));
	return div;
}
function feedback(x)
{
	var div=createElement('div','');
	var comments=createElement('div','');
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
	if(feed[x]==undefined) return;
	var status= document.createElement('select');
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

function createimage(x)
{
	var img = document.createElement('img');
	img.src = PHP_FOLDER_LOCATION + "image.php?id=" + x;

	// Might be nice to replace onmouseover with some jquery image box effect
	img.onmouseover = function() {
		this.style.height = '281px';
		this.style.width = '450px';
	}
	img.onmouseout = function() {
		this.style.height = '80px';
		this.style.width = '100px';
	}
	return img;
}

// don't really need this function....
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
