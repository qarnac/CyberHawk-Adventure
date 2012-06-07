<?php
include '../php/credentials.php';
if(isset($_POST['user']))
{
	$usrname=mysql_escape_string($_POST['user']);
	$pwd=mysql_escape_string($_POST['pwd']);
	
	$query="SELECT * FROM students WHERE username='$usrname' AND password='$pwd'";
	$result=mysql_query($query) or die(mysql_error());
	if(mysql_num_rows($result)==1)
	{
		session_start();
		$result=mysql_fetch_assoc($result);
		$_SESSION=$result;
		$_SESSION['login']=true;
		echo "true";
	}
	else {
		echo "false";
	}
	
}
?>