<?php
// php file called from createKML.js
// Returns all of the activities in a specific hunt.
include '../php/credentials.php';
$result=mysql_query("SELECT * 
					FROM  `stud_activity` 
					WHERE  `hunt_id` = " . $_POST['huntid'] . ";") or die(mysql_error());
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