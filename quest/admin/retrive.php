<?php
//Retrives the students name and also all the column from the table stud_activity with respect to id of the hunt.
//Used by Ajax request from wscript.js .
//Returns Json string to the Client
session_start();
if (isset($_SESSION['login']) == true && $_SESSION['who'] == 'teacher') {
	include '../php/credentials.php';
	if (isset($_POST['what'])=='activities' && isset($_POST['id'])) {
		$x = query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE stud_activity.hunt_id='" . mysql_escape_string($_POST['id']) . "' AND students.id=stud_activity.student_id");
		if (mysql_num_rows($x) == 0) {echo "false";
		} else {
			$z = array();
			while ($m = mysql_fetch_assoc($x))
				array_push($z, $m);
			$z = json_encode($z);
			echo $z;
		}
	}
	else if(isset($_POST['what'])=='hunts')
	{
		logged();
	}
}
else {
	echo "sessionfail";
}

function logged() {
	

	$hunts = array();
	$result = query("SELECT * FROM hunt WHERE tid='" . $_SESSION['id'] . "' AND status='open'");
	if (mysql_num_rows($result) > 0) {
		while ($x = mysql_fetch_assoc($result)) {
			array_push($hunts, $x);
		}
	}
	
	$temp[0] =$_SESSION['firstname'];
	$temp[1]=$hunts;
	$temp=json_encode($temp);
	echo $temp;
}

function query($x) {
	$result = mysql_query($x) or die(mysql_error());
	return $result;
}
?>