<?php
session_start();
/*
 * This automatically gets appropriate hunt which is active to particular student depending on the teacher of the student.
 * It displays forms and allows user to fill the required information
 * allows image to be dropped or selected from a directory and also compresses the image and also tags the image with geo location if found in the meta tag else it asks user to tag the location of the image with a google map.
 * submits the data to the server
 */
 // Not really sure why this one specifies the encoding when none of the other php files do.
mb_internal_encoding("UTF-8"); 
if(isset($_SESSION['login'])==true)
{
	include '../php/credentials.php';
	if($_POST['what']='hunts' && $_SESSION['who']=='students') logged();
}
else 
{
		echo "sessionfail";
}

// Following function is only used as user.
// Don't understand what this function does.  I'll have to look into it later to try and understand it.
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


?>