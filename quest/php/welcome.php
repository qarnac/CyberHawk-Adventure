<?php
/*
 * Checks for the Session
 * If there is no valid session redirects to the Login page
 * Displays hunts created by the Teacher who logged in.
 * Displays the activity created by students by showing a list of students who created activity and teacher can select a student to view the activity
 */
session_start();
include '../php/credentials.php';
if($_SESSION['who']=='teacher') admin_logged();
else if($_SESSION['who']=='students') user_logged();

function admin_logged()
{
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
	include dirname(__FILE__) . '/html/admin_welcome_page.php';
}

function user_logged()
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
			$hunts=json_encode($hunts);
include dirname(__FILE__) . '/htm/user_welcome_page.php';
}
?>