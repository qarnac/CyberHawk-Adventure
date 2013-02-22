<?php
include '../php/credentials.php';
if(isset($_POST['user']))
{
	$username=mysql_escape_string($_POST['user']);
	$pwd=mysql_escape_string($_POST['pwd']);
	$who=mysql_escape_string($_POST['who']);
	if(isset($_POST['parent']) && $_POST['parent']!=0){
		$parent=$_POST['parent'];
		$query="SELECT * FROM $who WHERE username='$username' AND password='$pwd' AND parentHunt='$parent'";
		} else $query="SELECT * FROM $who WHERE username='$username' AND password='$pwd'";
	$result=mysql_query($query) or die(mysql_error());
	if(mysql_num_rows($result)==1)
	{
		session_start();
		$result=mysql_fetch_assoc($result);
		$_SESSION=$result;
		$_SESSION['login']=true;
		$_SESSION['who']=$who;
		echo "true";
	}
	else {
		echo "false";
	}
}


?>