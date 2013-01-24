<?php
	include '../php/credentials.php';
	$availableHunts = array();
	$result = mysql_query("
		SELECT *
		FROM hunt"
		) or die(mysql_error());
	if (mysql_num_rows($result) > 0) {
		while ($x = mysql_fetch_assoc($result)) {
			array_push($availableHunts, $x);
		}
	}
	echo json_encode($availableHunts);
?>