<?php
if(!isset($_SESSION)) session_start();
include '../php/credentials.php';

if (isset($_POST['id'])) {
	$studentactivities = mysql_query("
		SELECT stud_activity.*, students.firstname, students.lastname
		FROM stud_activity, students
		WHERE stud_activity.hunt_id='" . mysql_escape_string($_POST['id']) . "'
		AND students.id=stud_activity.student_id"
		) or die(mysql_error());

	if (mysql_num_rows($studentactivities) == 0) { //checks atleast for one student activity 
		echo "none";
	} else {
		$z = array(); // Temporary variable used to convert mysql resource to array
		while ($m = mysql_fetch_assoc($studentactivities)) {
			array_push($z, $m);
		}
		echo json_encode($z);
	}

} 
else {
	echo 'No post data';
}
?>