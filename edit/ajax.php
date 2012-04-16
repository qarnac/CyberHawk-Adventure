<?php
//securing the right source expected .doesnt accept request from other server
$from= $_SERVER['HTTP_REFERER'];
$construct="http://". $_SERVER['SERVER_NAME']."/edit/".$_GET['what']."/";
//
if($from==$construct)
{
	
	include "../php/credentials.php";
	if($_GET['get']=="location")
	{
		$id=mysql_real_escape_string($_GET['id']);
		$query = "SELECT * FROM location WHERE belong=$id ";
		$location = mysql_query($query, $dbconnect);
		$out="";
		$i=0;
		while($row = mysql_fetch_array($location))
  		{
	 
		  if($i==0)
		  {
	  		$out=$out."'".$row['title']."',".$row['latitude'].",".$row['longitude'].",".$row['id'];
	  		$i=1;
		  }
	  		else
	  	 	$out=$out.",'".$row['title']."',".$row['latitude'].",".$row['longitude'].",".$row['id']; 
  		}
  		echo $out;
	}
	else if($_GET['get']=="activity")
	{
		$id=mysql_real_escape_string($_GET['id']);
		$query = "SELECT * FROM meta WHERE tname='$id'";
		$result = mysql_query($query,$dbconnect);
		if (!$result) {
    		echo 'Could not run query: ' . mysql_error();
    		exit;
		}
		
		if (mysql_num_rows($result) > 0) {
    		while ($row = mysql_fetch_array($result)) {
				echo $row['content'];
    		}
			
		}
		
			
			
		}
	
	
}


?>