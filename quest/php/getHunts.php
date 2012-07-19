<?php
session_start();
include '../php/credentials.php';
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
?>