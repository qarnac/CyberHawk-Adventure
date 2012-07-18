<?php
if($_SESSION['who'] == 'teacher'){
		if (isset($_POST['what']) == 'activities' && isset($_POST['id'])) {
			activities($_POST['id']);
	} else if (isset($_POST['what']) == 'hunts') {
		hunts();
		}
	}
	
	
	// Following functions are only used as admin.
// This function seems to just query the database for a list of all of the student activities, pushes them into an array, and echo's them.
function activities($x) {
	$studentactivities = mysql_query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE stud_activity.hunt_id='" . mysql_escape_string($x) . "' AND students.id=stud_activity.student_id") or die("mysqlfailed");
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

//IF Session is valid this returns the username along with the hunts created by the teacher where the status of them is open
function hunts() {
	$hunts = array();
	$result = mysql_query("SELECT * FROM hunt WHERE tid='" . $_SESSION['id'] . "' AND status='open'") or die("mysqlfailed");
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