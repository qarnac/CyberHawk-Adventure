<?php
session_start();
/*
 * This automatically gets appropriate hunt which is active to particular student depending on the teacher of the student.
 * It displays forms and allows user to fill the required information
 * allows image to be dropped or selected from a directory and also compresses the image and also tags the image with geo location if found in the meta tag else it asks user to tag the location of the image with a google map.
 * submits the data to the server
 */
mb_internal_encoding("UTF-8"); 
if(isset($_SESSION['login'])==true)
{
	include '../php/credentials.php';
	if($_POST['what']='hunts' && $_SESSION['who']=='students') logged();
	
	else if($_SESSION['who'] == 'teacher'){
		if (isset($_POST['what']) == 'activities' && isset($_POST['id'])) {
			activities($_POST['id']);
	} else if (isset($_POST['what']) == 'hunts') {
		hunts();
		}
	}
}
else 
{
		echo "sessionfail";
}

// Following function is only used as user.
function logged()
{
	
	$metah=mysql_query("SELECT * FROM meta" ) or die(mysql_error());
		$metaar=array();
		while($x=mysql_fetch_assoc($metah))
		array_push($metaar,$x);
		$hunts=array();
		$result=mysql_query("SELECT * FROM hunt WHERE tid='".$_SESSION['tid']."' AND status='open'" ) or die(mysql_error());
			if(mysql_num_rows($result)>0)
			{
				while($x=mysql_fetch_assoc($result))
				{
				array_push($hunts,$x);
				}
			}
			$temp[0]= $_SESSION['firstname'];
			$temp[1]=$hunts;
			$temp[2]=$metaar;
			echo json_encode($temp);
}

// Following functions are only used as admin.

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