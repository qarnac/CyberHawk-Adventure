<?php
session_start();
include '../php/credentials.php';

if ($_POST['what']=='hunts' && $_SESSION['who']=='students') {
	getHuntsStudent();
}
else if ($_POST['what']=='hunts' && $_SESSION['who']=='teacher') {
	getHuntsTeacher();
}
else {
	include dirname(__FILE__) . '/getActivity.php';
}

// Echos temp, which contains users first name, list of their hunts that are open, and the form data from createActivity.html
// Why does this also grab the create activity form?  Could we do that once the user clicks new activity instead?
function getHuntsStudent()
{
	$createActivityForm = file_get_contents(GLBOALS->HTML_FOLDER_LOCATION . "createActivity.html");
	$availableHunts = array();
	$result = mysql_query("
		SELECT *
		FROM hunt
		WHERE teacher_id='".$_SESSION['teacher_id']."'
		AND status='open'"
		) or die(mysql_error());

	if(mysql_num_rows($result) > 0)
	{
		while($x = mysql_fetch_assoc($result)) {
			array_push($availableHunts,$x);
		}
	}
	else {
		echo "sessionfail result <= 0";
	}
	$temp[0]= "student";
	$temp[1]=$availableHunts;
	$temp[2]=$createActivityForm;
	echo json_encode($temp);
}

function getHuntsTeacher()
{
	$availableHunts = array();
	$result = mysql_query("
		SELECT *
		FROM hunt
		WHERE teacher_id='" . $_SESSION['id'] . "'
		AND status='open'"
		) or die(mysql_error());
	if (mysql_num_rows($result) > 0) {
		while ($x = mysql_fetch_assoc($result)) {
			array_push($availableHunts, $x);
		}
	}
	$temp[0] = $_SESSION['firstname'];
	$temp[1] = $availableHunts;
	$temp = json_encode($temp);
	echo $temp;
}
?>