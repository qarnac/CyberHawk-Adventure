<?php include '../php/credentials.php';
session_start();

if($_SESSION['who']=="teacher"){
	$hunt_id=mysql_insert_id();
	mysql_query("INSERT INTO `hunt` SET " . 
	"title='" . mysql_escape_string($_POST["title"]) . 
	"', minlat='" . mysql_escape_string($_POST["minLat"]) . 
	"', minlng='" . mysql_escape_string($_POST["minLng"]) . 
	"', maxlat='" . mysql_escape_string($_POST["maxLat"]) . 
	"', maxlng='" . mysql_escape_string($_POST["maxLng"]) . 
	"', additionalQuestions='" . mysql_escape_string($_POST["additionalQuestions"]) .
	"', eventdate=FROM_UNIXTIME(" . $_POST["dateOfTrip"] .
	"), id='" . $hunt_id .
	"', teacher_id='" . $_SESSION['id'] .
	"', eventcreation='" . date('Y-m-d') . "';") or die(mysql_error());
	
	$huntId=mysql_insert_id();
	mysql_query("INSERT INTO students SET ".
		"username='" . mysql_escape_string($_POST["username"]) . 
		"', firstname='" . mysql_escape_string($_POST["username"]) .
		"', password='" . mysql_escape_string($_POST["password"]) .
		"', lastname='" . mysql_escape_string($_POST["password"]) .
		"', id='" . mysql_insert_id() .
		"', teacher_id='" . $_SESSION['id'] .
		"', parentHunt=" . $huntId .
		";") or die(mysql_error());
		
		echo "success";
}
?>