<?php
/*
 * Updates the Status of the activity.
 * Used by Ajax request from wscript.js
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if (isset($_POST['content'])) {
		process($_POST['content']);
		//if there is unexpected request from the client
	} else echo "unexpectedrequest";
		
// Do we really need this in a function when it's really the only thing in this file?
//Processes the data sent from the client to upload it to the Database
function process($x) {
	$content = json_decode(x);
	$x = array_keys(get_object_vars($content));
	for ($i = 0; $i < count($x); $i++)
		mysql_query("UPDATE stud_activity SET status='" . mysql_escape_string($content -> $x[$i] -> grant) . "',comments='" . mysql_escape_string($content -> $x[$i] -> comment) . "' WHERE id='" . $x[$i] . "' ") or die("mysqlfailed");
	echo "sucess";
}
?>

