<?php
/*
 * Retrives the students name and also all the column from the table stud_activity with respect to id of the hunt.
 * Checks for the user session and also returns the hunts created by teacher if that is requested.
 *Used by Ajax request from wscript.js .
 *Returns Json string to the Client
 */
 // The if statement is needed solely because user_retrieve.php is used incorrectly at some point that I can not find, and so it redirects here.
 // When the statement that calls user_retrieve instead of teacher_retrieve is fixed, this if can be removed.
if (!isset($_SESSION)) session_start();
if (isset($_SESSION['login']) == true && $_SESSION['who'] == 'teacher') {
	include '../php/credentials.php';
	//$_POST['what'] says what is the data actually needed. if what = activities then it returns the activities created by students with respect to the requested hunt id else id what=hunts then it returns the username of current user along with the hunts created by the particular teacher
	if (isset($_POST['what']) == 'activities' && isset($_POST['id'])) {
		activities($_POST['id']);
	} else if (isset($_POST['what']) == 'hunts') {
		hunts();
	}
} else {
	echo "sessionfail";
}
// Queries the database for the list of student activities, and echos them.
function activities($x) {
	$studentactivities = mysql_query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE stud_activity.hunt_id='" . mysql_escape_string($x) . "' AND students.id=stud_activity.student_id") or die(mysql_error());
	if (mysql_num_rows($studentactivities) == 0) { //checks atleast for one student activity 
		echo "none";
	} else {
		$z = array();
		// Temporary variable used to convert mysql resource to array
		while ($m = mysql_fetch_assoc($studentactivities))
			array_push($z, $m);
		echo json_encode($z);
	}
}

// Finds all open hunts where tid==Session[id].  Then echos result.
function hunts() {
	$hunts = array();
	$result = mysql_query("SELECT * FROM hunt WHERE tid='" . $_SESSION['id'] . "' AND status='open'") or die(mysql_error());
	if (mysql_num_rows($result) > 0) {
		while ($x = mysql_fetch_assoc($result)) {
			array_push($hunts, $x);
		}
	}
	$temp[0] = $_SESSION['firstname'];
	$temp[1] = $hunts;
	$temp = json_encode($temp);
	echo $temp;
}
?>