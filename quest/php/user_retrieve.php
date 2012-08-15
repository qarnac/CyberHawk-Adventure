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
include '../php/credentials.php';
// Until huntsel(x) is fixed, this needs to be here so that way teachers that are given this php file will just get redirected to the correct file.
if ($_POST['what']=='hunts' && $_SESSION['who']=='students') {
	logged();
}
else {
	include dirname(__FILE__) . '/getActivity.php';
}

	// Just like the other file, I'm not really sure we need to keep this wrapped in a function anymore.
// Echos temp, which contains users first name, list of their hunts that are open, and everything that's stored in meta.
function logged()
{
	$metah=mysql_query("SELECT * FROM meta" ) or die(mysql_error());
		$metaar=file_get_contents("http://ouyangdev.cs.csusm.edu/cyberhawk/quest/html/createActivity.html");
		$hunts=array();
		$result=mysql_query("SELECT * FROM hunt WHERE teacher_id='".$_SESSION['teacher_id']."' AND status='open'" ) or die(mysql_error());
			if(mysql_num_rows($result)>0)
			{
				while($x=mysql_fetch_assoc($result))
				{
				array_push($hunts,$x);
				}
			} else echo "sessionfail result<=0";
			$temp[0]= $_SESSION['firstname'];
			$temp[1]=$hunts;
			$temp[2]=$metaar;
			echo json_encode($temp);
}


?>

