<?php
/*
 * Checks for the Session
 * If there is no valid session redirects to the Login page
 * Displays hunts created by the Teacher who logged in.
 * Displays the activity created by students by showing a list of students who created activity and teacher can select a student to view the activity
 */
session_start();
if(isset($_SESSION['login'])==true&&$_SESSION['who']=='teacher')
logged();
else if($_SESSION['who']=='students')
{
header("Location: ../user");	
}
else {
		header("Location: ../");
}
function logged()
{
	include '../php/credentials.php';
	$metah=mysql_query("SELECT * FROM meta" ) or die(mysql_error());
		$metaar=array();
		while($x=mysql_fetch_assoc($metah))
		array_push($metaar,$x);
		$hunts=array();
		$result=mysql_query("SELECT * FROM hunt WHERE tid='".$_SESSION['id']."' AND status='open'" ) or die(mysql_error());
			if(mysql_num_rows($result)>0)
			{
				while($x=mysql_fetch_assoc($result))
				{
				array_push($hunts,$x);
				}
			}
			$hunts=json_encode($hunts);
	include dirname(__FILE__) . '/html/welcome_page.php';
}

?>