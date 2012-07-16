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
function create_activity_obj(x) {
	if (x == "none")//server returns false if it cannot find any activities
		alert("No one has created acticity yet");
	else {
		x = JSON.parse(x);

		var list_box = listbox();
		feedactivity(x, list_box);
		$('students').appendChild(list_box);
		$('students').appendChild(clear());
		$('students').appendChild(updatebutton());
		//actdisp(x[m]);
	}

}

function feedactivity(x, list_box) {
	for ( m = 0; m < x.length; m++) {
		var z;
		if (activities.hassid(x[m]['student_id']) == 'false') {
			z = new Object();
			z.sid = x[m]['student_id'];
			z.contents = new Array();
			z.contents.push(x[m]);
			activities.push(z);
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
		ajax('content=' + JSON.stringify(feed), '../php/upload.php', handleupload);
	};
	return temp;
}

function listbox() {
	var temp = document.createElement('select');
	temp.id = 'slist';
	temp.size = 20;
	temp.multiple = 'multiple';
	temp.addoption = function(label, value) {
		this.options[this.options.length] = new Option(label, value);
	};
	temp.onchange = function() {
		$('activity').innerHTML = "";
		var x = activities.hassid(this.value);
		if (x != "false") {
			for ( i = 0; i < activities[x].contents.length; i++)
				displayactivity(activities[x].contents[i])
		} else
			alert("something went wrong")
	};
	return temp;
}

//displays the activity
function displayactivity(x) {
	var div = document.createElement('div');
	div.className = 'elem';
	//Image Element
	div.appendChild(createimage(x['media_id']));
	div.appendChild(clear());
	//USER Name elements ,Multiple choice question Elements
	div.appendChild(createElement('label', x['firstname'] + " " + x['lastname']))
	div.appendChild(multiplechoice(x['mquestion'],JSON.parse(x['choices'])));
	div.appendChild(clear());
	//Other Question Elements
	div.appendChild(otherquestions(x));
	div.appendChild(clear());
	//Comments and status Elements ad their Eventhandling on onchange to update the variable feed
	div.appendChild(feedback(x['id']));
	div.appendChild(clear());
	//Horijontal Ruler
	div.appendChild(createElement('hr',''));
	//Append the div element to the div 'activity'
	$('activity').appendChild(div);
}
function multiplechoice(question,ans)
{
	var div=createElement('div', '');
	var mchoice = createElement('label',question);
	mchoice.style.width = '550px';
	div.appendChild(mchoice);
	div.appendChild(clear());
	for ( y = 0; y < ans.choices.length; y++)
		if (ans.choices[y].ans == "true") {
			var temp = createElement('label', ans.choices[y].choice + " . " + ans.choices[y].content);
			temp.style.color = "green";
			div.appendChild(temp);
		} else
			div.appendChild(createElement('label', ans.choices[y].choice + " . " + ans.choices[y].content));
	return div;
}
function otherquestions(x)
{
	var div=createElement('div', '');
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
	img.src = "../quest/php/image.php?id=" + x;
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
