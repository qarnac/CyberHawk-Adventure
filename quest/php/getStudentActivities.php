<?php
// This file is to be called when the student wants to see a list of all of the activities that they have submitted.
// This php file simply queries the server, and then echo's the list of all the activities.
session_start();
include '../php/credentials.php';
$result=mysql_query("SELECT * 
					FROM  `stud_activity` 
					WHERE  `student_id` =" . $_SESSION['id'] . "
					AND 'hunt_id' = " . $_POST['hunt']) or die(mysql_error());
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