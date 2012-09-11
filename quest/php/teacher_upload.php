<?php
/*
 * Updates the Status of the activity.
 * Used by Ajax request from wscript.js
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
mysql_query("UPDATE stud_activity SET status='" . mysql_escape_string($_POST["status"]) . "',comments='" . mysql_escape_string($_POST["comments"]) . "' WHERE id='" . $_POST["id"] . "' ") or die("mysqlfailed");
echo $_POST["comments"];
?>

