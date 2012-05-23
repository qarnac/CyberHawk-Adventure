<?php


include "credentials.php";	 //dbase credentials + dbase connection

$id=$_REQUEST['id'];		//pulls question id from the url 
$query = "SELECT * FROM video where id='$id'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);

if(mysql_num_rows($ques)>0)
header("Location: ".$result['videos']);


?>