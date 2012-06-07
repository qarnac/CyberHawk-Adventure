<?php
$user="ouyang";		//dbase username
$pass="youwen";		//dbase pwd
$host="localhost";	// dbse host
$dbase="cyberscavenger";
if(!$dbconnect = mysql_connect($host, $user, $pass)) {  //connects to dbase host
   echo "Connection failed to the host";
   exit;
} // if
if (!mysql_select_db($dbase)) {//selects dbase
   echo "Cannot connect to database 'test'";
   exit;
} // if
?>