<?php
session_start();
/*
 * This automatically gets appropriate hunt which is active to particular student depending on the teacher of the student.
 * It displays forms and allows user to fill the required information
 * allows image to be dropped or selected from a directory and also compresses the image and also tags the image with geo location if found in the meta tag else it asks user to tag the location of the image with a google map.
 * submits the data to the server
 */
mb_internal_encoding("UTF-8"); 
if(isset($_SESSION['login'])==true&&$_SESSION['who']=='students')
{if($_POST['what']='hunts')
logged();}

else 
{
		echo "sessionfail";
}
function logged()
{
	include '../php/credentials.php';
	$metah=query("SELECT * FROM meta" );
		$metaar=array();
		while($x=mysql_fetch_assoc($metah))
		array_push($metaar,$x);
		$hunts=array();
		$result=query("SELECT * FROM hunt WHERE tid='".$_SESSION['tid']."' AND status='open'" );
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


function query($x)
{
	$query=$x;
	$result=mysql_query($query) or die(mysql_error());
	return $result;
}
?>