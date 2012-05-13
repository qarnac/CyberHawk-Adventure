<?php

if($_SERVER['REQUEST_METHOD']=="POST")
{
	include "../../php/credentials.php";
	$locid=mysql_real_escape_string($_POST['locid']);
	$a_type=mysql_real_escape_string($_POST['a_type']);
	$contents=explode(",",$_POST['f_contents']);
	unset($contents[array_search("tabtitle",$contents)]);
	$n_name=mysql_real_escape_string($_POST['tabtitle']);
	
	$a_type=rtrim($a_type," ");
	$n_path="/".$a_type.'.php';
	
	
		$table_id = 'questions'; //this table has the information about all the quadrants
		$query = "SELECT qid FROM $table_id WHERE qbelong='$locid'";
		$subloc = mysql_query($query, $dbconnect);
		
		$newid= mysql_num_rows($subloc);
		$ltempid=$locid.'0';
		$newid++;
		$newid=$ltempid+$newid;
		
		
		
		$query="INSERT INTO table_id (path,name,status,qid,qbelong)
VALUES ('$n_path','$n_name','1','$newid','$locid')";
	echo $query;
	$q_content="";
	foreach($contents as $i)
	$q_content=$q_content.$i.",";
	$q_content=substr($q_content,0,strlen($q_content)-1);
	$q_content=str_replace("'", "", $q_content);
	echo $q_content;
	//$query="INSERT INTO table_id 
	
	
}



?>