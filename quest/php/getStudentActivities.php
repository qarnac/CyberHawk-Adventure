<?php
// This file is to be called when the student wants to see a list of all of the activities that they have submitted.
// This php file simply queries the server, and then echo's the list of all the activities.
session_start();
include '../php/credentials.php';
$result=mysql_query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE stud_activity.hunt_id='" . $_POST['hunt']. "' AND students.firstname='" . $_POST['name'] ."'") or die(mysql_error());
$activityList=array();
if(mysql_num_rows($result)>0)
			{
				while($x=mysql_fetch_assoc($result))
				{
				array_push($activityList,$x);
				}
			} 
			$temp[0]= $_SESSION['firstname'];
			$temp[1]=$activityList;
echo json_encode($activityList);

?>