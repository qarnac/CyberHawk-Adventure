/**
 * @author sabareesh kkanan subramani
 */
var hunts;// All the hunts from the teacher will be stored in this variable

var activities = new Array();
// Holds all the activities of a particular hunt organised by student id
var feed = {};
// Has the status of each activity like its id,comment and status.
//Instantiates the array activities with student activitivities
//This function is invoked by ajax function but this happens when the teacher selects a hunt.
//It creates the list of all students and display them in the list box along with a update button.
//It also creates the array activities .
function create_activity_obj(x) {
	if (x == "false")//server returns false if it cannot find any activities
		alert("No one has created acticity yet");
	else {
		x = JSON.parse(x);

		var temp = document.createElement('select');
		temp.id = 'slist';
		temp.size = 10;
		temp.multiple ='multiple';

		for ( m = 0; m < x.length; m++) {

			if (activities.hassid(x[m]['student_id']) == 'false') {
				var z = new Object();
				z.sid = x[m]['student_id'];
				z.contents = new Array();
				z.contents.push(x[m]);
				activities.push(z);
				temp.options[temp.options.length] = new Option(x[m]['firstname'] + " " + x[m]['lastname'], x[m]['student_id']);

				temp.onchange = function() {
					$('activity').innerHTML = "";
					var x = activities.hassid(this.value);
					if (x != "false") {
						for ( i = 0; i < activities[x].contents.length; i++)
							displayactivity(activities[x].contents[i])
					} else
						alert("something went wrong")
				};

			} else {
				var z = activities.hassid(x[m]['student_id']);
				activities[z].contents.push(x[m]);
			}
			var z = new Object();
			z.grant = "true";
			z.comment = '';
			feed[x[m]['id']] = z;

		}

		$('students').appendChild(temp);
		temp = document.createElement('input');
		temp.type = 'button';
		temp.value = "Update DB";
		//When this button is clicked the feed array is sent to the server
		temp.onclick = function() {
			ajax('content=' + JSON.stringify(feed), 'upload.php', function(x) {
				alert(x)
			})
		};
		$('students').appendChild(temp);
		//actdisp(x[m]);
	}

}
//displays the activity
function displayactivity(x) {
	var div = document.createElement('div');
	div.className = 'elem';
	//Image Element
	var img = document.createElement('img');
	img.src = "../php/image.php?id=" + x['media_id'];
	img.onmouseover = function() {
		this.style.height = '281px';
		this.style.width = '450px';
	}
	img.onmouseout = function() {
		this.style.height = '80px';
		this.style.width = '100px';
	}
	div.appendChild(img);
	//Dummy place holder for image as because image is used with absolute positioning
	var dummy = document.createElement('div');
	dummy.className = 'dummyimg';
	div.appendChild(dummy);
	//USER Name elements ,Multiple choice question Elements
	div.appendChild(createElement('label', x['firstname'] + " " + x['lastname']))
	var ans = JSON.parse(x['choices']);
	temp = createElement('label', 'Multiple Chocie Question : ' + x['mquestion']);
	temp.style.width = '550px';
	div.appendChild(temp);
	temp = createElement('div', '');
	temp.className = 'clear';
	div.appendChild(temp);
	for ( y = 0; y < ans.choices.length; y++)
		if (ans.choices[y].ans == "true") {
			var temp = createElement('label', ans.choices[y].choice + " . " + ans.choices[y].content);
			temp.style.color = "green";
			div.appendChild(temp);
		} else
			div.appendChild(createElement('label', ans.choices[y].choice + " . " + ans.choices[y].content));
	//Clears the Div
	temp = createElement('div', '');
	temp.className = 'clear';
	div.appendChild(temp);
	//Other Question Elements
	div.appendChild(createElement('label', 'About    : ' + x['aboutmedia']));
	div.appendChild(createElement('label', 'Reason   : ' + x['whythis']));
	div.appendChild(createElement('label', 'Evidence : ' + x['howhelpfull']));
	div.appendChild(createElement('label', 'Question : ' + x['yourdoubt']));
	//Clears the Div

	temp = createElement('div', '');
	temp.className = 'clear';
	div.appendChild(temp);
	//Comments and status Elements ad their Eventhandling on onchange to update the variable feed
	var comments = createElement('label', 'Comments');
	comments.style.width = '80px';
	var temp1 = document.createElement('textarea');
	temp1.onchange = function() {
		feed[x['id']].comment = this.value;
	}
	comments.appendChild(temp1);

	temp = document.createElement('select');
	temp.options[temp.options.length] = new Option("ACCEPT", "true");
	temp.options[temp.options.length] = new Option("DECLINE", "false");

	temp.onchange = function() {
		if (this.value == "false") {
			this.parentNode.insertBefore(comments, this.nextSibling);
			feed[x['id']].grant = "false";
		} else {
			this.parentNode.removeChild(comments);
			feed[x['id']].grant = 'true';
			feed[x['id']].comment = '';
		}

	};
	temp.value = feed[x['id']].grant;
	div.appendChild(temp);
	if (temp.value == "false") {
		comments.childNodes[1].value = feed[x['id']].comment;
		temp.parentNode.insertBefore(comments, temp.nextSibling);
	}

	//Horijontal Ruler
	div.appendChild(document.createElement('hr'));
	//Append the div element to the div 'activity'
	$('activity').appendChild(div);
}