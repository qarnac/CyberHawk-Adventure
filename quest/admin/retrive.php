<?php
//Retrives the students name and also all the column from the table stud_activity with respect to id of the hunt.
//Used by Ajax request from wscript.js .
//Returns Json string to the Client
if(isset($_POST['id']))
{
	include "../php/credentials.php";
	$x=mysql_query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE stud_activity.hunt_id='".mysql_escape_string($_POST['id'])."' AND students.id=stud_activity.student_id");
	if(mysql_num_rows($x)==0)
	{echo "false";}
	else {
		$z=array();
		while($m=mysql_fetch_assoc($x))
		array_push($z,$m);
		$z=json_encode($z);
		echo $z;
	}

}
?>