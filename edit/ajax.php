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
		$result = mysql_query("SHOW FULL COLUMNS FROM ".$id);
		if (!$result) {
    		echo 'Could not run query: ' . mysql_error();
    		exit;
		}
		$out="g";
		$i=0;
		if (mysql_num_rows($result) > 0) {
    		while ($row = mysql_fetch_array($result)) {
				if($i==0)
        		{$out="'".$row[0].",".$row['Comment']."'";
				$i=1;}
				else
				$out=$out.",'".$row[0].",".$row['Comment']."'";
    		}
			echo $out;
		}
		
	}
}


?>