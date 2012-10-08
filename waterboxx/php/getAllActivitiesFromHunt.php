<?php
// php file called from createKML.js
// Returns all of the activities in a specific hunt.
include '../php/credentials.php';
$result=mysql_query("SELECT stud_activity.*, students.firstname, students.lastname 
					FROM  `stud_activity`, students 
					WHERE  `hunt_id` = " . $_POST['huntid'] . "
					AND stud_activity.student_id=students.id;") or die(mysql_error());
$activityList=array();
if(mysql_num_rows($result)>0)
	{
		while($x=mysql_fetch_assoc($result))
		{
			array_push($activityList,$x);
		}
	} 
echo json_encode($activityList);
?>