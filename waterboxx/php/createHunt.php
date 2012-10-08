<?php include '../php/credentials.php';
session_start();

if($_SESSION['who']=="teacher"){
	$status="open";
	mysql_query("INSERT INTO `hunt`(title, minlat, minlng, maxlat, maxlng, eventdate, teacher_id, eventcreation, status) VALUES('" .
	mysql_escape_string($_POST["title"]) . "','" . mysql_escape_string($_POST["minLat"]) . "','" .
	mysql_escape_string($_POST["minLng"]) . "','" . mysql_escape_string($_POST["maxLat"]) . "','" .
	mysql_escape_string($_POST["maxLng"]) . "','" . $_POST["endDate"] . "','" .
	$_SESSION['id'] . "','" . date('Y-m-d') ."','open');");
}
?>