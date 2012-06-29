
<?php
/*
 * gets data from javascript and updates datbase and images
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if(isset($_POST['content'])&&isset($_SESSION['who'])=='teacher')
{
	$content=json_decode($_POST['content']);
	$x=array_keys(get_object_vars($content));
	for($i=0;$i<count($x);$i++)
	query("UPDATE stud_activity SET status='".$content->$x[$i]->grant."',comments='".$content->$x[$i]->comment."' WHERE id='".$x[$i]."' ");
}

//dbase query executer
function query($x)
{
	$result=mysql_query($x) or die(mysql_error());
	return $result;
}
//escapes mysql injection
function esc($x)
{
	return mysql_escape_string($x);
}


?>

